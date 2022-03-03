import React from "react";
import ChatInput from "js/features/chat/ChatInput";

test("renders nick form when editing nick", () => {
  render(<ChatInput active={true} nick="Ernie" editingNick={true} />);
  expect(document.getElementById("messageForm")).not.toBeInTheDocument();
  expect(document.getElementById("nickForm")).toHaveFormValues({ input: "Ernie" });
});

test("renders message form when not editing nick", () => {
  render(<ChatInput active={true} nick="Ernie" editingNick={false} />);
  expect(document.getElementById("messageForm")).toHaveFormValues({ input: "" });
  expect(document.getElementById("nickForm")).not.toBeInTheDocument();
});
