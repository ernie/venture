import React from "react";
import SlidePreview from "js/features/presentation/SlidePreview";
import { SlideState } from "js/features/presentation/presentationSlice";

test("renders when there's a slide", () => {
  const slide: SlideState = { type: "slide", location: { story: "main", index: 0 } };
  render(<SlidePreview slide={slide} />);
  expect(document.getElementById("slide-main-0")).toBeInTheDocument();
});

test("doesn't render when there's no slide", () => {
  const { container } = render(<SlidePreview slide={undefined} />);
  expect(container).toBeEmptyDOMElement();
});
