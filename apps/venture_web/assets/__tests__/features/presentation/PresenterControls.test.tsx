import React from "react";
import PresenterControls from "js/features/presentation/PresenterControls";
import { fireEvent } from "@testing-library/react";
import { prevSlide, nextSlide, reset, reload } from "js/features/presentation/presentationSlice";

const store = useStore({ mockDispatch: true });

test("dispatches prevSlide on clicking button", () => {
  render(<PresenterControls />);
  fireEvent.click(document.getElementById("prevButton"));
  expect(store.dispatch).toBeCalledWith(prevSlide());
});

test("dispatches nextSlide on clicking button", () => {
  render(<PresenterControls />);
  fireEvent.click(document.getElementById("nextButton"));
  expect(store.dispatch).toBeCalledWith(nextSlide());
});

test("dispatches reset on clicking button", () => {
  render(<PresenterControls />);
  fireEvent.click(document.getElementById("resetButton"));
  expect(store.dispatch).toBeCalledWith(reset());
});

test("dispatches reload on clicking button", () => {
  render(<PresenterControls />);
  fireEvent.click(document.getElementById("reloadButton"));
  expect(store.dispatch).toBeCalledWith(reload());
});

test("dispatches prevSlide on page up", () => {
  render(<PresenterControls />);
  fireEvent.keyDown(window, { key: "PageUp" });
  expect(store.dispatch).toBeCalledWith(prevSlide());
});

test("dispatches prevSlide on left arrow", () => {
  render(<PresenterControls />);
  fireEvent.keyDown(window, { key: "ArrowLeft" });
  expect(store.dispatch).toBeCalledWith(prevSlide());
});

test("dispatches nextSlide on space bar", () => {
  render(<PresenterControls />);
  fireEvent.keyDown(window, { key: " " });
  expect(store.dispatch).toBeCalledWith(nextSlide());
});

test("dispatches nextSlide on page down", () => {
  render(<PresenterControls />);
  fireEvent.keyDown(window, { key: "PageDown" });
  expect(store.dispatch).toBeCalledWith(nextSlide());
});

test("dispatches nextSlide on right arrow", () => {
  render(<PresenterControls />);
  fireEvent.keyDown(window, { key: "ArrowRight" });
  expect(store.dispatch).toBeCalledWith(nextSlide());
});
