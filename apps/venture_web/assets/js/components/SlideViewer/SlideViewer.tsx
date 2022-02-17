import React from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import SlideContainer from "../SlideContainer/SlideContainer";
import PresenterOverlay from "../PresenterOverlay/PresenterOverlay";

import { Slide } from "../../records/Slides";

interface SlideViewerProps {
  slide: Slide;
  isPresenter: boolean;
  channel: Channel;
}

export default class SlideViewer extends React.Component<SlideViewerProps> {

  static propTypes = {
    slide: PropTypes.object.isRequired,
    isPresenter: PropTypes.bool.isRequired,
    channel: PropTypes.object.isRequired
  }

  render() {
    let { isPresenter, slide, channel } = this.props;
    let className = isPresenter ? "presenter" : "attendee";
    return (
      <div className="viewer">
        <PresenterOverlay
          channel={channel}
          isPresenter={isPresenter}
          slide={slide}
        />
        <SlideContainer
          channel={channel}
          className={className}
          slide={slide}
        />
      </div>
    );
  }

}
