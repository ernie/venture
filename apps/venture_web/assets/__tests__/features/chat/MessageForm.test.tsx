import React from "react";
import { fireEvent } from "@testing-library/react";
import { editNick, sendMessage } from "js/features/chat/chatSlice";
import { RootState } from "js/store";
import MessageForm from "js/features/chat/MessageForm";

const store = useStore({ mockDispatch: true });

const mockState: RootState = {
  session: { accessKey: undefined },
  presentation: { slide: {}, selections: {}, connections: {} },
  chat: {
    nick: "Ernie",
    editingNick: false,
    prefilledMessage: "this is a prefilled message",
    messages: [],
    nicks: [],
    history: ["Hello!", "Hello again!"]
  }
}

let originalGetState: typeof store.getState;

beforeEach(() => {
  originalGetState = store.getState;
  store.getState = () => mockState;
});

afterEach(() => {
  store.getState = originalGetState;
});

test("renders the nick on the nick button", () => {
  render(<MessageForm active={true} nick="Ernie" />);
  expect(document.getElementById("nickButton").innerHTML).toContain("Ernie");
});

test("dispatches editNick on nick button click if active", () => {
  render(<MessageForm active={true} nick="Ernie" />);
  fireEvent.click(document.getElementById("nickButton"));
  expect(store.dispatch).toBeCalledWith(editNick());
});

test("does not dispatch on nick button click if inactive", () => {
  render(<MessageForm active={false} nick="Ernie" />);
  fireEvent.click(document.getElementById("nickButton"));
  expect(store.dispatch).not.toBeCalledWith(editNick());
});

test("populates the message input based on prefilledMessage", () => {
  render(<MessageForm active={true} nick="Ernie" />);
  expect(document.getElementById("messageInput").getAttribute("value")).toEqual(mockState.chat.prefilledMessage);
});

test("browses history with up/down arrows", () => {
  render(<MessageForm active={true} nick="Ernie" />);
  const messageInput = document.getElementById("messageInput");
  fireEvent.keyDown(messageInput, { key: "ArrowUp" });
  expect(messageInput.getAttribute("value")).toEqual(mockState.chat.history.at(-0));
  fireEvent.keyDown(messageInput, { key: "ArrowUp" });
  expect(messageInput.getAttribute("value")).toEqual(mockState.chat.history.at(-1));
  fireEvent.keyDown(messageInput, { key: "ArrowDown" });
  expect(messageInput.getAttribute("value")).toEqual(mockState.chat.history.at(-0));
  fireEvent.keyDown(messageInput, { key: "ArrowDown" });
  expect(messageInput.getAttribute("value")).toEqual("");
});

test("sends the message in the input field when submit is clicked", () => {
  render(<MessageForm active={true} nick="Ernie" />);
  const messageForm = document.getElementById("messageForm");
  fireEvent.submit(messageForm);
  expect(store.dispatch).toBeCalledWith(sendMessage(mockState.chat.prefilledMessage));
});
