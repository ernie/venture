import styles from './_PollSlide.scss';
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

export default class PollSlide extends React.Component {

  static propTypes = {
    options: PropTypes.array.isRequired,
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
    this.setState({ selected: e.currentTarget.dataset.option });
    SlideActions.selectOption(this.props.channel, e.currentTarget.dataset.option);
  }

  handleChange = () => {
    this.setState(getState());
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

  stylesFor = (option) => {
    let max = this.maxSelections();
    if (max === 0) {
      return { width: 0 }
    } else {
      return { width: `${(this.state.selections[option] / max * 100)}%` }
    }
  }

  renderOption = (option) => {
    let max = this.maxSelections();
    let selected = (this.state.selected === option ? styles.selected : null);
    let winner = null;
    if (max > 0 && this.state.selections[option] === max) {
      winner = styles.winner;
    }
    return (
      <li
        className={classNames(styles.option, selected, winner)}
        data-option={option}
        key={option}
        onClick={this.props.active ? this.selectOption : null}
      >
        {option} ({this.state.selections[option] || 0})
        <div
          className={styles.bar}
          style={this.stylesFor(option)}
        >
          {option} ({this.state.selections[option] || 0})
        </div>
      </li>
    );
  }

  render() {
    return (
      <div className={'content'}>
        <div
          className={slideStyles.markdown}
          dangerouslySetInnerHTML={
            { __html: Markdown.render(this.props.content) }
          }
        />
        <ul className={styles.options}>
          {this.props.options.map(this.renderOption)}
        </ul>
      </div>
    );
  }

}
