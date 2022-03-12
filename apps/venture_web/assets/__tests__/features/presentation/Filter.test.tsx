import React from "react";
import Filter from "js/features/presentation/Filter";
import { SlideState } from "js/features/presentation/presentationSlice";

test("darkens", () => {
  const slide: SlideState = {
    type: "slide",
    location: { story: "main", index: 0 },
    background: { darken: 0.5 }
  };
  render(<Filter slide={slide} />);
  const style = getComputedStyle(document.getElementsByClassName("filter")[0]);
  expect(style.backgroundColor).toEqual("rgb(0, 0, 0)");
  expect(style.opacity).toEqual("0.5");
});

test("lightens", () => {
  const slide: SlideState = {
    type: "slide",
    location: { story: "main", index: 0 },
    background: { lighten: 0.5 }
  };
  render(<Filter slide={slide} />);
  const style = getComputedStyle(document.getElementsByClassName("filter")[0]);
  expect(style.backgroundColor).toEqual("rgb(255, 255, 255)");
  expect(style.opacity).toEqual("0.5");
});
