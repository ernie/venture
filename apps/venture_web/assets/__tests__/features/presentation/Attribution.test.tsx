import React from "react";
import Attribution from "js/features/presentation/Attribution";

test("renders in supplied position", () => {
  render(<Attribution content="* Attribution" position="top left" />);
  const attribution = document.getElementsByClassName("attribution")[0];
  const style = getComputedStyle(attribution);
  expect(style.top).toEqual("0px");
  expect(style.left).toEqual("0px");
  expect(style.textAlign).toEqual("left");
});
