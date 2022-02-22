import React from "react";

import SlideContainer from "./SlideContainer";

import { SlideState } from "./presentationSlice";

interface SlidePreviewProps {
  slide: SlideState;
}

const SlidePreview = ({ slide }: SlidePreviewProps) => {

  if (slide) {
    return (
      <SlideContainer
        active={false}
        className="slidePreview"
        slide={slide}
      />
    );
  } else {
    return null;
  }

}

export default SlidePreview;
