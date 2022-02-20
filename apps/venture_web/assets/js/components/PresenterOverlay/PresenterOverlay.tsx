import React from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import PresenterControls from "../PresenterControls/PresenterControls";
import ConnectionsDisplay from "../ConnectionsDisplay/ConnectionsDisplay";
import Notes from "../Notes/Notes";
import SlidePreview from "../SlidePreview/SlidePreview";
import { Slide } from "../../records/Slides";

interface PresenterOverlayProps {
  slide: Slide;
  channel: Channel;
  isPresenter: boolean;
}

const PresenterOverlay = ({ slide, channel, isPresenter }: PresenterOverlayProps) => {

  if (isPresenter) {
    return (
      <div className="presenterOverlay">
        <PresenterControls channel={channel} />
        <ConnectionsDisplay />
        <Notes notes={slide.notes} />
        <SlidePreview channel={channel} slide={slide.next} />
      </div>
    );
  } else {
    return false;
  }

}

PresenterOverlay.propTypes = {
  slide: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  isPresenter: PropTypes.bool.isRequired
}

export default PresenterOverlay;
