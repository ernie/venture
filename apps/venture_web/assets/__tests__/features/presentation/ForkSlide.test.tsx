import React from "react";
import ForkSlide from "js/features/presentation/ForkSlide";
import { SlideState, optionSelect } from "js/features/presentation/presentationSlice";
import { RootState } from "js/store";
import { fireEvent } from "@testing-library/react";

const store = useStore({ mockDispatch: true });

const mockState: RootState = {
  presentation: {
    selections: {
      "story1:0": 12,
      "story2:0": 34
    }
  }
}

const paths: Array<SlideState> = [
  {
    type: "slide",
    location: { story: "story1", index: 0 },
    content: "Story 1"
  },
  {
    type: "slide",
    location: { story: "story2", index: 0 },
    content: "Story 2"
  }
];

let originalGetState: typeof store.getState;

beforeEach(() => {
  originalGetState = store.getState;
  store.getState = () => mockState;
});

afterEach(() => {
  store.getState = originalGetState;
});

test("renders the content", () => {
  render(<ForkSlide active={true} content="**This is the content**" paths={paths} />);
  expect(document.getElementsByClassName("content")[0]).toContainHTML("<strong>This is the content</strong>");
});

test("renders the options", () => {
  render(<ForkSlide active={true} content="**This is the content**" paths={paths} />);
  expect(document.getElementById("slide-story1-0")).toContainHTML("Story 1");
  expect(document.getElementById("slide-story2-0")).toContainHTML("Story 2");
  const [option1, option2] = document.getElementsByClassName("forkOption");
  expect(option1.getElementsByClassName("forkSelectionCount")[0]).toContainHTML("12");
  expect(option2.getElementsByClassName("forkSelectionCount")[0]).toContainHTML("34");
});

test("dispatches votes when active", () => {
  render(<ForkSlide active={true} content="**This is the content**" paths={paths} />);
  fireEvent.click(document.getElementById("slide-story1-0"));
  expect(store.dispatch).toBeCalledWith(optionSelect("story1:0"));
});

test("doesn't dispatch votes when inactive", () => {
  render(<ForkSlide active={false} content="**This is the content**" paths={paths} />);
  fireEvent.click(document.getElementById("slide-story1-0"));
  expect(store.dispatch).not.toBeCalledWith(optionSelect("story1:0"));
});

test("indicates the winner", () => {
  render(<ForkSlide active={true} content="**This is the content**" paths={paths} />);
  const [option1, option2] = document.getElementsByClassName("forkOption");
  expect(option1).not.toHaveClass("winner");
  expect(option2).toHaveClass("winner");
});

test("indicates the selection", () => {
  render(<ForkSlide active={true} content="**This is the content**" paths={paths} />);
  fireEvent.click(document.getElementById("slide-story1-0"));
  const [option1, option2] = document.getElementsByClassName("forkOption");
  expect(option1).toHaveClass("selected");
  expect(option2).not.toHaveClass("selected");
});
