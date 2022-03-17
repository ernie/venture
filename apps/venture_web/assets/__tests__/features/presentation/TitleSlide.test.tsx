import React from "react";
import TitleSlide from "js/features/presentation/TitleSlide";

const titleContent = "# Venture\n\n* Ernie Miller";

test("renders the content", () => {
  render(<TitleSlide content={titleContent} />);
  expect(document.getElementById("heading-venture")).toContainHTML("Venture");
  expect(document.getElementsByClassName("content")[0]).toContainHTML("<li>Ernie Miller</li>");
});
