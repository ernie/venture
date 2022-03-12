import React from "react";

import Slide from "./Slide";
import ForkSlide from "./ForkSlide";
import PollSlide from "./PollSlide";
import ChatSlide from "../chat/ChatSlide";
import TitleSlide from "./TitleSlide";
import Attribution from "./Attribution";
import { SlideState } from "./presentationSlice";

interface CanvasProps {
  active: boolean;
  slide: SlideState;
}

interface CanvasStyles {
  alignItems?:      "center" | "flex-start" | "flex-end";
  justifyContent?:  "center" | "flex-start" | "flex-end";
  textAlign?:       "center" | "left" | "right";
}

const Canvas = (props: CanvasProps) => {

  const attribution = () => {
    const slide = props.slide;
    const attribution = { position: "bottom right", content: "" };
    if (typeof slide.attribution === "string") {
      attribution.content = slide.attribution;
    } else if (typeof slide.attribution === "object") {
      Object.assign(attribution, slide.attribution);
    }
    return attribution;
  }

  const style = () => {
    const align = (props.slide.align || "").toLowerCase().trim();
    const style = {} as CanvasStyles;
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

  const renderSlide = () => {
    const { slide, active } = props;
    switch (slide.type) {
      case "slide":
        return (
          <Slide
            content={slide.content}
          />
        );
      case "title":
        return (
          <TitleSlide
            content={slide.content}
          />
        );
      case "fork":
        return (
          <ForkSlide
            active={active}
            content={slide.content}
            paths={slide.paths}
          />
        );
      case "poll":
        return (
          <PollSlide
            active={active}
            content={slide.content}
            options={slide.options}
          />
        );
      case "chat":
        return (
          <ChatSlide
            active={active}
          />
        );
      default:
        return (<div>Unknown slide type: {slide.type}</div>);
    }
  }

  const attrib = attribution();

  return (
    <div
      className={"canvas"}
      style={style()}
    >
      {renderSlide()}
      <Attribution
        content={attrib.content}
        position={attrib.position}
      />
    </div>
  );

}

export default Canvas;
