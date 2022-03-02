import React from "react";
import Notes from "js/features/presentation/Notes";

test("renders Markdown", () => {
  render(<Notes notes="**hello**" />);
  expect(document.getElementById("presentationNotes").innerHTML).toContain("<strong>hello</strong>");
});
