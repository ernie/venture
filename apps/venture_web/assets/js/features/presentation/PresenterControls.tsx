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
        <button onClick={() => dispatch(prevSlide())}>Prev</button>
        <button onClick={() => dispatch(nextSlide())}>Next</button>
      </div>
      <div className="presenterControlsRight">
        <button onClick={() => dispatch(reset())}>Reset</button>
        <button onClick={() => dispatch(reload())}>Reload</button>
      </div>
    </div>
  );

}

export default PresenterControls;
