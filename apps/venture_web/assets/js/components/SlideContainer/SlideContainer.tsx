import React from "react";
import PropTypes from "prop-types";

import Filter from "../Filter/Filter";
import Canvas from "../Canvas/Canvas";

import SlideRecord from "../../records/Slide";

import classNames from "classnames";

interface SlideContainerProps {
  slide: SlideRecord;
  channel: Object;
  className: string;
  active: boolean;
}

interface SlideStyles {
  image:     string | undefined;
  size:      string | undefined;
  repeat:    string | undefined;
  position:  string | undefined;
  color:     string | undefined;
}

interface BackgroundStyles {
  backgroundImage:     string | undefined;
  backgroundSize:      string | undefined;
  backgroundRepeat:    string | undefined;
  backgroundPosition:  string | undefined;
  backgroundColor:     string | undefined;
}

export default class SlideContainer extends React.Component<SlideContainerProps> {

  static propTypes = {
    slide: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    className: PropTypes.string,
    active: PropTypes.bool
  }

  static defaultProps = {
    className: "",
    active: true
  }

  backgroundStyle({ image, size, repeat, position, color }: SlideStyles) {
    let bgStyles = {} as BackgroundStyles;
    if (image) {
      bgStyles.backgroundImage =
        `url("/backgrounds/${image}")`;
    }
    if (size) {
      bgStyles.backgroundSize = size;
    }
    if (repeat) {
      bgStyles.backgroundRepeat = repeat;
    }
    if (position) {
      bgStyles.backgroundPosition = position;
    }
    if (color) {
      bgStyles.backgroundColor = color;
    }
    return bgStyles;
  }

  slideStyle = () => {
    let slide = this.props.slide;
    let slideStyle = {} as SlideStyles;
    if (typeof slide.background === "string") {
      if (slide.background.startsWith("#")) {
        slideStyle.color = slide.background;
      } else {
        slideStyle.image = slide.background;
      }
    } else if (typeof slide.background === "object") {
      Object.assign(slideStyle, slide.background);
    }
    return Object.assign({}, this.backgroundStyle(slideStyle));
  }

  render() {
    let { slide, channel, className, active } = this.props;
    let slideStyle = this.slideStyle();
    let baseClasses = slide.type !== "slide" ? [`${slide.type}-slide`] : [];
    let slideClasses = baseClasses.concat(slide.class || []);
    return (
      <div className={classNames(className, "slide-container")}>
        <div
          className={classNames("slide", ...slideClasses)}
          style={slideStyle}
        >
          <Filter slide={slide} />
          <Canvas
            active={active}
            channel={channel}
            slide={slide}
          />
        </div>
      </div>
    );
  }

}
