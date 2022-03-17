import React from "react";
import Slide from "js/features/presentation/Slide";

test("renders the Markdown", () => {
  render(<Slide content="**content!**" />);
  expect(document.firstElementChild).toContainHTML("<strong>content!</strong>");
});
