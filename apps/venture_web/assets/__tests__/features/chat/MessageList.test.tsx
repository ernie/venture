import React from "react";
import MessageList from "js/features/chat/MessageList";

const messages = [
  {
    content: "message 1"
  },
  {
    content: "message 2"
  }
];

test("renders the messages supplied", () => {
  render(<MessageList messages={messages} />);
  expect(document.getElementById("messageList")).toContainHTML("message 1")
  expect(document.getElementById("messageList")).toContainHTML("message 2")
});

// The scrolling behavior would be interesting to test, but in a headless browser
// feels like a yak I have no desire to shave.
