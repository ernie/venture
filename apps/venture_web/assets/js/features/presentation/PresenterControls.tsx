import React, { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { nextSlide, prevSlide, reset, reload } from "./presentationSlice";

const PresenterControls = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress, false);
    return () => {
      window.removeEventListener("keydown", handleKeyPress, false);
    };
  }, []);

  const handleKeyPress = (e: KeyboardEvent) => {
    switch(e.key) {
      case "PageUp":
      case "ArrowLeft":
        dispatch(prevSlide());
        break;
      case " ":
      case "Spacebar": // Older browsers
      case "PageDown":
      case "ArrowRight":
        dispatch(nextSlide());
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
        <button id="prevButton" onClick={() => dispatch(prevSlide())}>Prev</button>
        <button id="nextButton" onClick={() => dispatch(nextSlide())}>Next</button>
      </div>
      <div className="presenterControlsRight">
        <button id="resetButton" onClick={() => dispatch(reset())}>Reset</button>
        <button id="reloadButton" onClick={() => dispatch(reload())}>Reload</button>
      </div>
    </div>
  );

}

export default PresenterControls;
