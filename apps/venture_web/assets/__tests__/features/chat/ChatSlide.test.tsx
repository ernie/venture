import React from "react";
import ChatSlide from "js/features/chat/ChatSlide";
import { join, leave } from "js/features/chat/chatSlice";
import { RootState } from "js/store";

const store = useStore({ mockDispatch: true });

const mockState: RootState = {
  session: { accessKey: ":attendee" },
  presentation: { slide: {}, selections: {}, connections: {} },
  chat: {
    nick: "Ernie",
    editingNick: false,
    prefilledMessage: "this is a prefilled message",
    messages: [
      {
        type: "system",
        content: "Welcome!"
      },
      {
        content: "Hello!",
        sender: "Ernie"
      }
    ],
    nicks: [
      {id: "id-1", name: "Ernie"},
      {id: "id-2", name: "Bert"}
    ],
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

test("joins channel on mount", () => {
  render(<ChatSlide active={true} />);
  expect(store.dispatch).toBeCalledWith(join());
});

test("leaves channel on unmount", () => {
  const { unmount } = render(<ChatSlide active={true} />);
  unmount();
  expect(store.dispatch).toBeCalledWith(leave());
});
