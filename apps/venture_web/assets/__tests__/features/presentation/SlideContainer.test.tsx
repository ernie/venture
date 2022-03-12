import React from "react";
import SlideContainer from "js/features/presentation/SlideContainer";
import { SlideState } from "js/features/presentation/presentationSlice";

test("sets a background image from a string attribute", () => {
  const imageBgSlide: SlideState = {
    type: "slide",
    location: { story: "main", index: 0 },
    background: "background-image.png"
  };
  render(<SlideContainer slide={imageBgSlide} />);
  const style = getComputedStyle(document.getElementById("slide-main-0").firstElementChild);
  expect(style.backgroundImage).toEqual("url(assets/background-image.png)");
});

test("sets a background color from a string attribute", () => {
  const colorBgSlide: SlideState = {
    type: "slide",
    location: { story: "main", index: 0 },
    background: "#777"
  };
  render(<SlideContainer slide={colorBgSlide} />);
  const style = getComputedStyle(document.getElementById("slide-main-0").firstElementChild);
  expect(style.backgroundColor).toEqual("rgb(119, 119, 119)");
});

test("sets a background from an object attribute", () => {
  const objectBgSlide: SlideState = {
    type: "slide",
    location: { story: "main", index: 0 },
    background: {
      image: "background-image.png",
      color: "#777",
      size: "7em",
      position: "top right",
      repeat: "repeat"
    }
  };
  render(<SlideContainer slide={objectBgSlide} />);
  const style = getComputedStyle(document.getElementById("slide-main-0").firstElementChild);
  expect(style.backgroundImage).toEqual("url(assets/background-image.png)");
  expect(style.backgroundColor).toEqual("rgb(119, 119, 119)");
  expect(style.backgroundSize).toEqual("7em");
  expect(style.backgroundPosition).toEqual("top right");
  expect(style.backgroundRepeat).toEqual("repeat");
});

test("sets a darken filter", () => {
  const darkenBgSlide: SlideState = {
    type: "slide",
    location: { story: "main", index: 0 },
    background: { darken: 0.5 }
  };
  render(<SlideContainer slide={darkenBgSlide} />);
  const style = getComputedStyle(document.getElementsByClassName("filter")[0]);
  expect(style.backgroundColor).toEqual("rgb(0, 0, 0)");
  expect(style.opacity).toEqual("0.5");
});

test("sets a lighten filter", () => {
  const lightenBgSlide: SlideState = {
    type: "slide",
    location: { story: "main", index: 0 },
    background: { lighten: 0.5 }
  };
  render(<SlideContainer slide={lightenBgSlide} />);
  const style = getComputedStyle(document.getElementsByClassName("filter")[0]);
  expect(style.backgroundColor).toEqual("rgb(255, 255, 255)");
  expect(style.opacity).toEqual("0.5");
});

test("deactivates pointer events when not active", () => {
  const slide: SlideState = {
    type: "slide",
    location: { story: "main", index: 0 }
  }
  render(<SlideContainer slide={slide} active={false} />);
  const style = getComputedStyle(document.getElementById("slide-main-0"));
  expect(style.pointerEvents).toEqual("none");
});
