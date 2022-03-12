import React from "react";
import NickList from "js/features/chat/NickList";
import { Nick, prefillDirectMessage } from "js/features/chat/chatSlice";
import { fireEvent } from "@testing-library/react";

const store = useStore({ mockDispatch: true });

const nicks: Array<Nick> = [
  { name: "Bert", id: "uuid1" },
  { name: "Ernie", id: "uuid2" }
]

const lurkers: Array<Nick> = [
  { name: undefined, id: "uuid3" },
  { name: undefined, id: "uuid4" }
]

test("renders nicks and lurkers", () => {
  render(<NickList active={true} nicks={nicks.concat(lurkers)} />);
  expect(document.getElementsByClassName("lurkers")[0]).toContainHTML("2 lurkers");
  expect(document.getElementsByClassName("nicks")[0].children).toHaveLength(2);
  expect(document.getElementsByClassName("nicks")[0]).toContainHTML("Bert");
  expect(document.getElementsByClassName("nicks")[0]).toContainHTML("Ernie");
});

test("prefills message on nick click", () => {
  const { getByTitle } = render(<NickList active={true} nicks={nicks.concat(lurkers)} />);
  fireEvent.click(getByTitle("Ernie"));
  expect(store.dispatch).toBeCalledWith(prefillDirectMessage("Ernie"));
});

test("singularizes lurker text", () => {
  render(<NickList active={true} nicks={lurkers.slice(1)} />);
  expect(document.getElementsByClassName("lurkers")[0]).toContainHTML("1 lurker");
});

test("does not render lurkers if no lurkers", () => {
  render(<NickList active={true} nicks={nicks} />);
  expect(document.getElementsByClassName("lurkers")).toHaveLength(0);
});
