import React from "react";
import PropTypes from "prop-types";

import SlideRecord from "../../records/Slide";

interface FilterProps {
  slide: SlideRecord;
}

interface FilterStyles {
  backgroundColor: string;
  opacity: number;
}

export default class Filter extends React.Component<FilterProps> {

  static propTypes = {
    slide: PropTypes.object.isRequired
  }

  style = () => {
    let style = {} as FilterStyles;
    let bg = this.props.slide.background || {};
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

  render() {
    return (
      <div
        className="filter"
        style={this.style()}
      />
    );
  }

}
