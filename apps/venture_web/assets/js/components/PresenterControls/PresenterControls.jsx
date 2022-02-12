import React from 'react';
import PropTypes from 'prop-types';

import SlideActions from '../../actions/SlideActions';

export default class PresenterControls extends React.Component {

  static propTypes = {
    channel: PropTypes.object.isRequired
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress, false);
  }

  nextSlide = () => {
    SlideActions.nextSlide(this.props.channel);
  }

  prevSlide = () => {
    SlideActions.prevSlide(this.props.channel);
  }

  resetPresentation = () => {
    SlideActions.resetPresentation(this.props.channel);
  }

  reloadDeck = () => {
    SlideActions.reloadDeck(this.props.channel);
  }

  handleKeyPress = (e) => {
    switch(e.keyCode) {
      case 33: // Page up
      case 37: // Left arrow
        this.prevSlide();
        break;
      case 32: // Space
      case 34: // Page down
      case 39: // Right arrow
        this.nextSlide();
        break
      case 27:  // Escape
      case 116: // F5
        // Anything on "present" button?
        break;
      case 190: // Period
        // Anything on "clear screen" button?
        break;
      default:
    }
  }

  render() {
    return (
      <div className="presenterControls">
        <div className="presenterControlsLeft">
          <button onClick={this.prevSlide}>Prev</button>
          <button onClick={this.nextSlide}>Next</button>
        </div>
        <div className="presenterControlsRight">
          <button onClick={this.resetPresentation}>Reset</button>
          <button onClick={this.reloadDeck}>Reload</button>
        </div>
      </div>
    );
  }

}
