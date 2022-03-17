import React from "react";
import PollSlide from "js/features/presentation/PollSlide";
import { SlideState, optionSelect } from "js/features/presentation/presentationSlice";
import { RootState } from "js/store";
import { fireEvent } from "@testing-library/react";

const store = useStore({ mockDispatch: true });

const mockState: RootState = {
  presentation: {
    selections: {
      "option1": 12,
      "option2": 34
    }
  }
}

const options = ["option1", "option2"];
let originalGetState: typeof store.getState;

beforeEach(() => {
  originalGetState = store.getState;
  store.getState = () => mockState;
});

afterEach(() => {
  store.getState = originalGetState;
});

test("renders the content", () => {
  render(<PollSlide active={true} content="**This is the content**" options={options} />);
  expect(document.getElementsByClassName("content")[0]).toContainHTML("<strong>This is the content</strong>");
});

test("renders the options", () => {
  render(<PollSlide active={true} content="**This is the content**" options={options} />);
  const [option1, option2] = document.getElementsByClassName("pollOption");
  expect(option1).toContainHTML("option1 (12)");
  expect(option2).toContainHTML("option2 (34)");
});

test("dispatches votes when active", () => {
  render(<PollSlide active={true} content="**This is the content**" options={options} />);
  fireEvent.click(document.getElementsByTagName("li")[1]);
  expect(store.dispatch).toBeCalledWith(optionSelect("option2"));
});

test("doesn't dispatch votes when inactive", () => {
  render(<PollSlide active={false} content="**This is the content**" options={options} />);
  fireEvent.click(document.getElementsByTagName("li")[1]);
  expect(store.dispatch).not.toBeCalledWith(optionSelect("option2"));
});

test("indicates the winner", () => {
  render(<PollSlide active={true} content="**This is the content**" options={options} />);
  const [option1, option2] = document.getElementsByClassName("pollOption");
  expect(option1).not.toHaveClass("winner");
  expect(option2).toHaveClass("winner");
});

test("indicates the selection", () => {
  render(<PollSlide active={true} content="**This is the content**" options={options} />);
  fireEvent.click(document.getElementsByTagName("li")[1]);
  const [option1, option2] = document.getElementsByClassName("pollOption");
  expect(option1).not.toHaveClass("selected");
  expect(option2).toHaveClass("selected");
});
