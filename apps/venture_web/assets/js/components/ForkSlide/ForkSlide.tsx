import React from "react";
import PropTypes from "prop-types";
import SlideActions from "../../actions/SlideActions";
import SelectionsStore from "../../stores/SelectionsStore";

import Markdown from "../../Markdown";
import classNames from "classnames";

import SlideContainer from "../SlideContainer/SlideContainer";

import SlideRecord from "../../records/Slide";

function getState() {
  return {
    selections: SelectionsStore.get()
  } as ForkSlideState;
}

interface ForkSlideProps {
  paths: Array<SlideRecord>;
  content: string;
  channel: Object;
  active: boolean;
}

interface ForkSlideState {
  selections:  Object;
  selected:    string | undefined;
}

interface Location {
  story: string;
  index: number;
}

export default class ForkSlide extends React.Component<ForkSlideProps> {

  static propTypes = {
    paths: PropTypes.array.isRequired,
    content: PropTypes.string.isRequired,
    channel: PropTypes.object.isRequired,
    active: PropTypes.bool
  }

  static defaultProps = {
    active: true
  }

  state = getState();

  componentDidMount() {
    SelectionsStore.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    SelectionsStore.removeChangeListener(this.handleChange);
  }

  selectOption = (e: React.UIEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (this.props.active) {
      this.setState({ selected: e.currentTarget.dataset.option });
      SlideActions.selectOption(this.props.channel, e.currentTarget.dataset.option);
    }
  }

  handleChange = () => {
    this.setState(getState());
  }

  locationString(loc: Location) {
    return `${loc.story}:${loc.index}`;
  }

  maxSelections = () => {
    let max = 0;
    let selections = this.state.selections;
    for (var key in selections) {
      if (selections.hasOwnProperty(key)) {
        if (selections[key] > max) {
          max = selections[key];
        }
      }
    }
    return max;
  }

  renderPath = (pathSlide: SlideRecord) => {
    let max = this.maxSelections();
    let location = this.locationString(pathSlide.location);
    let selected = (this.state.selected === location ? "selected" : null);
    let winner = null;
    if (max > 0 && this.state.selections[location] === max) {
      winner = "winner";
    }
    return (
      <li
        className={classNames("forkOption", selected, winner)}
        data-option={location}
        key={location}
        onClick={this.selectOption}>
        <SlideContainer
          active={false}
          channel={this.props.channel}
          slide={pathSlide}
        />
        <div className="forkSelectionCount">
          {this.state.selections[location] || 0}
        </div>
      </li>
    );
  }

  render() {
    return (
      <div className="content">
        <div
          className="markdown"
          dangerouslySetInnerHTML={
            { __html: Markdown.render(this.props.content) }
          }
        />
        <ul className="forkOptions">
          {this.props.paths.map(this.renderPath)}
        </ul>
      </div>
    );
  }

}
