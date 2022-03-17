import React from "react";
import SlideViewer from "js/features/presentation/SlideViewer";
import { SlideState } from "js/features/presentation/presentationSlice";

const slide: SlideState = {
  type: "slide",
  location: { story: "main", index: 0 },
  content: "This is peak content"
}

test("renders presenter overlay if presenter", () => {
  render(<SlideViewer slide={slide} isPresenter={true} />);
  expect(document.getElementById("presenterOverlay")).toBeInTheDocument();
});

test("doesn't render presenter overlay if attendee", () => {
  render(<SlideViewer slide={slide} isPresenter={false} />);
  expect(document.getElementById("presenterOverlay")).toBeNull();
});

test("adds a class for presenter status to container", () => {
  render(<SlideViewer slide={slide} isPresenter={true} />);
  expect(document.getElementById("slide-main-0").className).toContain("presenter");
  expect(document.getElementById("slide-main-0").className).not.toContain("attendee");
});

test("adds a class for attendee status to container", () => {
  render(<SlideViewer slide={slide} isPresenter={false} />);
  expect(document.getElementById("slide-main-0").className).toContain("attendee");
  expect(document.getElementById("slide-main-0").className).not.toContain("presenter");
});
