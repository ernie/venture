import React from "react";
import PresenterOverlay from "js/features/presentation/PresenterOverlay";
import { SlideState } from "js/features/presentation/presentationSlice";

const slide: SlideState = {
  type: "slide",
  location: { story: "main", index: 0 },
  notes: "This is a note",
  next: {
    type: "slide",
    location: { story: "main", index: 1 },
    content: "next slide"
  }
}

test("doesn't render if not presenter", () => {
  const { container } = render(<PresenterOverlay slide={slide} isPresenter={false} />);
  expect(container).toBeEmptyDOMElement();
});

test("renders if presenter", () => {
  render(<PresenterOverlay slide={slide} isPresenter={true} />);
  expect(document.getElementById("presenterOverlay")).toBeInTheDocument();
  expect(document.getElementById("presentationNotes").innerHTML).toContain("This is a note");
  expect(document.getElementById("slide-main-1").innerHTML).toContain("next slide");
});
