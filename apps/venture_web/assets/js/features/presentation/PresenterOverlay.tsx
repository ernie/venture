import React from "react";

import PresenterControls from "./PresenterControls";
import ConnectionsDisplay from "./ConnectionsDisplay";
import Notes from "./Notes";
import SlidePreview from "./SlidePreview";
import { SlideState } from "./presentationSlice";

interface PresenterOverlayProps {
  slide: SlideState;
  isPresenter: boolean;
}

const PresenterOverlay = ({ slide, isPresenter }: PresenterOverlayProps) => {

  if (isPresenter) {
    return (
      <div id="presenterOverlay">
        <PresenterControls />
        <ConnectionsDisplay />
        <Notes notes={slide.notes} />
        <SlidePreview slide={slide.next} />
      </div>
    );
  } else {
    return null;
  }

}

export default PresenterOverlay;
