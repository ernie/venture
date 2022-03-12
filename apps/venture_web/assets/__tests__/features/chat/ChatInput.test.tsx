import React from "react";
import ChatInput from "js/features/chat/ChatInput";

test("renders nick form when editing nick", () => {
  render(<ChatInput active={true} nick="Ernie" editingNick={true} />);
  expect(document.getElementsByClassName("messageForm")).toHaveLength(0);
  expect(document.getElementsByClassName("nickForm")[0]).toHaveFormValues({ input: "Ernie" });
});

test("renders message form when not editing nick", () => {
  render(<ChatInput active={true} nick="Ernie" editingNick={false} />);
  expect(document.getElementsByClassName("messageForm")[0]).toHaveFormValues({ input: "" });
  expect(document.getElementsByClassName("nickForm")).toHaveLength(0);
});
