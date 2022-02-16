import React from "react";
import PropTypes from "prop-types";
import PresenterControls from "../PresenterControls/PresenterControls";
import ConnectionsDisplay from "../ConnectionsDisplay/ConnectionsDisplay";
import Notes from "../Notes/Notes";
import SlidePreview from "../SlidePreview/SlidePreview";
import Slide from "../../records/Slide";

interface PresenterOverlayProps {
  slide: Slide;
  channel: Object;
  isPresenter: boolean;
}

export default class PresenterOverlay extends React.Component<PresenterOverlayProps> {

  static propTypes = {
    slide: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    isPresenter: PropTypes.bool.isRequired
  }

  render() {
    let { slide, channel } = this.props;
    if (this.props.isPresenter) {
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

}
