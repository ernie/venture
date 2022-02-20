import React from "react";
import PropTypes from "prop-types";

import { Slide } from "../../records/Slides";

interface FilterProps {
  slide: Slide;
}

interface FilterStyles {
  backgroundColor: string;
  opacity: number;
}

const Filter = ({ slide }: FilterProps) => {

  const style = () => {
    let style = {} as FilterStyles;
    let bg = slide.background || {};
    if (typeof bg === "object") {
      if (bg.darken) {
        style.backgroundColor = "#000";
        style.opacity = bg.darken;
      } else if (bg.lighten) {
        style.backgroundColor = "#fff";
        style.opacity = bg.lighten;
      }
    }
    return style;
  }

  return (
    <div
      className="filter"
      style={style()}
    />
  );

}

Filter.propTypes = {
  slide: PropTypes.object.isRequired
}

export default Filter;
