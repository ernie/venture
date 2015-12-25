import styles from './_ForkSlide.scss';

import slideStyles from '../Slide/_Slide.scss';

import React, { PropTypes } from 'react';
import SlideActions from '../../actions/SlideActions';
import SelectionsStore from '../../stores/SelectionsStore';

import Markdown from '../../../lib/Markdown';
import classNames from 'classnames';

import SlideContainer from '../SlideContainer/SlideContainer';

function getState() {
  return {
    selections: SelectionsStore.get()
  };
}

export default class ForkSlide extends React.Component {

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

  selectOption = (e) => {
    e.preventDefault();
    if (this.props.active) {
      this.setState({ selected: e.currentTarget.dataset.option });
      SlideActions.selectOption(this.props.channel, e.currentTarget.dataset.option);
    }
  }

  handleChange = () => {
    this.setState(getState());
  }

  locationString(loc) {
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

  renderPath = (pathSlide) => {
    let max = this.maxSelections();
    let location = this.locationString(pathSlide.location);
    let selected = (this.state.selected === location ? styles.selected : null);
    let winner = null;
    if (max > 0 && this.state.selections[location] === max) {
      winner = styles.winner;
    }
    return (
      <li
        className={classNames(styles.option, selected, winner)}
        data-option={location}
        key={location}
        onClick={this.selectOption}>
        <SlideContainer
          active={false}
          channel={this.props.channel}
          slide={pathSlide}
        />
        <div className={styles.selectionCount}>
          {this.state.selections[location] || 0}
        </div>
      </li>
    );
  }

  render() {
    return (
      <div className={'content'}>
        <div
          className={classNames('markdown', slideStyles.markdown)}
          dangerouslySetInnerHTML={
            { __html: Markdown.render(this.props.content) }
          }
        />
        <ul className={styles.options}>
          {this.props.paths.map(this.renderPath)}
        </ul>
      </div>
    );
  }

}
