import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import KeyRequester from "js/features/session/KeyRequester";

test("prompts for a key", () => {
  render(<KeyRequester />);
  expect(document.getElementById("keyRequester")).toHaveTextContent("I'm an attendee!");
  expect(document.getElementById("keyRequester")).toHaveTextContent("I'm just the presenter");
});

test("clicking presenter link shows the form", () => {
  const { getByText } = render(<KeyRequester />);
  fireEvent.click(getByText(/I'm just the presenter/));
  expect(document.getElementById("presenterLink")).not.toBeVisible();
  expect(document.getElementById("keyForm")).toBeVisible();
});
