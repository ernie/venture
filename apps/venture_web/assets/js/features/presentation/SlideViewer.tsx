import React from "react";

import SlideContainer from "./SlideContainer";
import PresenterOverlay from "./PresenterOverlay";

import { SlideState } from "./presentationSlice";

interface SlideViewerProps {
  slide: SlideState;
  isPresenter: boolean;
}

const SlideViewer = ({ slide, isPresenter }: SlideViewerProps) => {
  const className = isPresenter ? "presenter" : "attendee";
  return (
    <div id="slideViewer" className="viewer">
      <PresenterOverlay
        isPresenter={isPresenter}
        slide={slide}
      />
      <SlideContainer
        className={className}
        slide={slide}
      />
    </div>
  );

}

export default SlideViewer;
