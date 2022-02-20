import React from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import SlideContainer from "../SlideContainer/SlideContainer";

import { Slide } from "../../records/Slides";

interface SlidePreviewProps {
  channel: Channel;
  slide: Slide;
}

const SlidePreview = ({ channel, slide }: SlidePreviewProps) => {
  if (slide) {
    return (
      <SlideContainer
        active={false}
        channel={channel}
        className="slidePreview"
        slide={slide}
      />
    );
  } else {
    return false;
  }

}

SlidePreview.propTypes = {
  channel: PropTypes.object.isRequired,
  slide: PropTypes.object
}

export default SlidePreview;
