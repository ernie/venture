import React from "react";
import PropTypes from "prop-types";

import { Channel } from "phoenix";

import Filter from "../Filter/Filter";
import Canvas from "../Canvas/Canvas";

import { Slide } from "../../records/Slides";

import classNames from "classnames";

interface SlideContainerProps {
  slide: Slide;
  channel: Channel;
  className: string;
  active: boolean;
}

interface SlideStyles {
  image?:          string;
  size?:           string;
  repeat?:         string;
  position?:       string;
  color?:          string;
}

interface BackgroundStyles {
  backgroundImage?:     string;
  backgroundSize?:      string;
  backgroundRepeat?:    string;
  backgroundPosition?:  string;
  backgroundColor?:     string;
}

const SlideContainer = ({slide, channel, className = "", active = true}: SlideContainerProps) => {

  const deactivatePointerEvents: React.CSSProperties = {
    pointerEvents: "none"
  }

  const backgroundStyle = ({ image, size, repeat, position, color }: SlideStyles) => {
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

  const slideStyle = () => {
    let style = {} as SlideStyles;
    if (typeof slide.background === "string") {
      if (slide.background.startsWith("#")) {
        style.color = slide.background;
      } else {
        style.image = slide.background;
      }
    } else if (typeof slide.background === "object") {
      Object.assign(style, slide.background);
    }
    return Object.assign({}, backgroundStyle(style));
  }

  const baseClasses = slide.type !== "slide" ? [`${slide.type}-slide`] : [];
  const slideClasses = baseClasses.concat(slide.class || []);
  return (
    <div className={classNames(className, "slide-container")} style={active ? null : deactivatePointerEvents}>
      <div
        className={classNames("slide", ...slideClasses)}
        style={slideStyle()}
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

SlideContainer.propTypes = {
  slide: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  className: PropTypes.string,
  active: PropTypes.bool
}

export default SlideContainer;
