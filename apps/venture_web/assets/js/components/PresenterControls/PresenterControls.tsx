import React from 'react';
import PropTypes from 'prop-types';

import SlideActions from '../../actions/SlideActions';

interface PresenterControlsProps {
  channel: Object;
}

export default class PresenterControls extends React.Component<PresenterControlsProps> {

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

  handleKeyPress = (e: KeyboardEvent) => {
    switch(e.key) {
      case "PageUp":
      case "ArrowLeft":
        this.prevSlide();
        break;
      case " ":
      case "Spacebar": // Older browsers
      case "PageDown":
      case "ArrowRight":
        this.nextSlide();
        break
      case "Escape":
      case "F5":
        // Anything on "present" button?
        break;
      case ".":
      case "Decimal": // Older browsers
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
