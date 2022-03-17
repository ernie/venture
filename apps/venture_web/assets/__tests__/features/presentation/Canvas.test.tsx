import React from "react";
import Canvas from "js/features/presentation/Canvas";
import { SlideState } from "js/features/presentation/presentationSlice";

test("renders slide", () => {
  const slide: SlideState = {
    type: "slide",
    location: { story: "main", index: 0 },
    content: "Hello world"
  }
  render(<Canvas active={true} slide={slide} />);
  expect(document.getElementsByClassName("content")[0]).toContainHTML("Hello world");
});

test("renders attribution", () => {
  const slide: SlideState = {
    type: "slide",
    location: { story: "main", index: 0 },
    content: "Hello world",
    attribution: "This is an attribution"
  }
  render(<Canvas active={true} slide={slide} />);
  expect(document.getElementsByClassName("attribution")[0]).toContainHTML("This is an attribution");
});

test("displays an error if an unknown slide type is received", () => {
  const slide: SlideState = {
    // @ts-ignore
    type: "nonexistent",
    location: { story: "main", index: 0 },
    content: "Hello world",
    attribution: "This is an attribution"
  }
  render(<Canvas active={true} slide={slide} />);
  expect(document.firstElementChild).toContainHTML("Unknown slide type: nonexistent");
});
