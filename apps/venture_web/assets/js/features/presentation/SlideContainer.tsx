import React from "react";

import Filter from "./Filter";
import Canvas from "./Canvas";

import { SlideState } from "./presentationSlice";

import classNames from "classnames";

interface SlideContainerProps {
  slide: SlideState;
  className?: string;
  active?: boolean;
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

const SlideContainer = ({slide, className = "", active = true}: SlideContainerProps) => {

  const deactivatePointerEvents: React.CSSProperties = {
    pointerEvents: "none"
  }

  const backgroundStyle = ({ image, size, repeat, position, color }: SlideStyles) => {
    let bgStyles = {} as BackgroundStyles;
    if (image) {
      image.startsWith("/") ?
        bgStyles.backgroundImage = `url("${image}")` :
        bgStyles.backgroundImage =
          `url("assets/${image}")`;
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
  const slideClasses = baseClasses.concat(slide.class);
  return (
    <div
      id={slide.location ? `slide-${slide.location.story}-${slide.location.index}` : null}
      className={classNames(className, "slide-container")}
      style={active ? null : deactivatePointerEvents}
    >
      <div
        className={classNames("slide", ...slideClasses)}
        style={slideStyle()}
      >
        <Filter slide={slide} />
        <Canvas
          active={active}
          slide={slide}
        />
      </div>
    </div>
  );

}

export default SlideContainer;
