import React from "react";
import { fireEvent } from "@testing-library/react";
import KeyRequester from "js/features/session/KeyRequester";
import { connect } from "js/features/session/sessionSlice";

const store = useStore({ mockDispatch: true });

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

test("clicking the attendee link connects with `:attendee`", () => {
  const { getByText } = render(<KeyRequester />);
  fireEvent.click(getByText(/I'm an attendee!/));
  expect(store.dispatch).toHaveBeenCalledWith(connect(":attendee"));
});

test("submitting the presenter form connects with the provided key", () => {
  const { getByText } = render(<KeyRequester />);
  fireEvent.click(getByText(/I'm just the presenter/));
  const keyForm = document.getElementById("keyForm");
  const keyInput = document.getElementById("keyInput");
  fireEvent.change(keyInput, { target: { value: "super-sekrit" } });
  fireEvent.submit(keyForm);
  expect(store.dispatch).toHaveBeenCalledWith(connect("super-sekrit"));
});
