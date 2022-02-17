import React from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import EmptySlide from "../EmptySlide/EmptySlide";
import Slide from "../Slide/Slide";
import ForkSlide from "../ForkSlide/ForkSlide";
import PollSlide from "../PollSlide/PollSlide";
import ChatSlide from "../ChatSlide/ChatSlide";
import TitleSlide from "../TitleSlide/TitleSlide";
import Attribution from "../Attribution/Attribution";

import {
  EmptySlide as EmptyRecord,
  ChatSlide as ChatRecord,
  PollSlide as PollRecord,
  ForkSlide as ForkRecord,
  TitleSlide as TitleRecord,
  Slide as SlideRecord
} from "../../records/Slides";

interface CanvasProps {
  active: boolean;
  channel: Channel;
  slide: SlideRecord | ForkRecord | PollRecord | TitleRecord | EmptyRecord | ChatRecord;
}

interface CanvasStyles {
  alignItems?:      "center" | "flex-start" | "flex-end";
  justifyContent?:  "center" | "flex-start" | "flex-end";
  textAlign?:       "center" | "left" | "right";
}

export default class Canvas extends React.Component<CanvasProps> {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    channel: PropTypes.object.isRequired,
    slide: PropTypes.object.isRequired
  }

  attribution = () => {
    let slide = this.props.slide;
    let attribution = {position: "bottom right", content: undefined};
    if (typeof slide.attribution === "string") {
      attribution.content = slide.attribution;
    } else if (typeof slide.attribution === "object") {
      Object.assign(attribution, slide.attribution);
    }
    return attribution;
  }

  style = () => {
    let align = (this.props.slide.align || "").toLowerCase().trim();
    let style = {} as CanvasStyles;
    align.split(/\s+/).forEach( (instruction) => {
      switch(instruction) {
        case "center":
          style.alignItems = "center";
          style.justifyContent = "center";
          style.textAlign = "center";
          break;
        case "top":
          style.alignItems = "flex-start";
          break;
        case "bottom":
          style.alignItems = "flex-end";
          break;
        case "left":
          style.justifyContent = "flex-start";
          style.textAlign = "left";
          break;
        case "right":
          style.justifyContent = "flex-end";
          style.textAlign = "right";
          break;
        default:
      }
    });
    return style;
  }

  renderSlide() {
    let { slide, channel, active } = this.props;
    let typedSlide = undefined;
    switch (slide.type) {
      case "empty":
        return (<EmptySlide />);
      case "slide":
        typedSlide = slide as SlideRecord;
        return (
          <Slide
            active={active}
            content={typedSlide.content}
          />
        );
      case "title":
        typedSlide = slide as TitleRecord;
        return (
          <TitleSlide
            active={active}
            content={typedSlide.content}
          />
        );
      case "fork":
        typedSlide = slide as ForkRecord;
        return (
          <ForkSlide
            active={active}
            channel={channel}
            content={typedSlide.content}
            paths={typedSlide.paths}
          />
        );
      case "poll":
        typedSlide = slide as PollRecord;
        return (
          <PollSlide
            active={active}
            channel={channel}
            content={typedSlide.content}
            options={typedSlide.options}
          />
        );
      case "chat":
        typedSlide = slide as ChatRecord;
        return (
          <ChatSlide
            active={active}
            content={typedSlide.content}
          />
        );
      default:
        return (<div>Unknown slide type: {slide.type}</div>);
    }
  }

  render() {
    let attribution = this.attribution();

    return (
      <div
        className={"canvas"}
        style={this.style()}
      >
        {this.renderSlide()}
        <Attribution
          content={attribution.content}
          position={attribution.position}
        />
      </div>
    );
  }

}
