import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import SlideActions from "../../actions/SlideActions";

interface PresenterControlsProps {
  channel: Channel;
}

const PresenterControls = ({ channel }: PresenterControlsProps) => {
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress, false);
    return () => {
      window.removeEventListener("keydown", handleKeyPress, false);
    };
  }, []);

  const nextSlide = () => {
    SlideActions.nextSlide(channel);
  }

  const prevSlide = () => {
    SlideActions.prevSlide(channel);
  }

  const resetPresentation = () => {
    SlideActions.resetPresentation(channel);
  }

  const reloadDeck = () => {
    SlideActions.reloadDeck(channel);
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    switch(e.key) {
      case "PageUp":
      case "ArrowLeft":
        prevSlide();
        break;
      case " ":
      case "Spacebar": // Older browsers
      case "PageDown":
      case "ArrowRight":
        nextSlide();
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

  return (
    <div className="presenterControls">
      <div className="presenterControlsLeft">
        <button onClick={prevSlide}>Prev</button>
        <button onClick={nextSlide}>Next</button>
      </div>
      <div className="presenterControlsRight">
        <button onClick={resetPresentation}>Reset</button>
        <button onClick={reloadDeck}>Reload</button>
      </div>
    </div>
  );

}

PresenterControls.propTypes = {
  channel: PropTypes.object.isRequired
}

export default PresenterControls;
