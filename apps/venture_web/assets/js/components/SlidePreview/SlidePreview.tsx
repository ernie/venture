import React from "react";
import PropTypes from "prop-types";

import SlideContainer from "../SlideContainer/SlideContainer";

import SlideRecord from "../../records/Slide";

interface SlidePreviewProps {
  channel: object;
  slide: SlideRecord;
}

export default class SlidePreview extends React.Component<SlidePreviewProps> {

  static propTypes = {
    channel: PropTypes.object.isRequired,
    slide: PropTypes.object
  }

  render() {
    if (this.props.slide) {
      return (
        <SlideContainer
          active={false}
          channel={this.props.channel}
          className="slidePreview"
          slide={this.props.slide}
        />
      );
    } else {
      return false;
    }
  }

}
