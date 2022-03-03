import React from "react";
import Message from "js/features/chat/Message";

test("renders a normal message", () => {
  const { container } = render(
    <Message message={
      {
        content: "Hello there",
        sender: "Ernie"
      }
    } />
  );
  expect(container.querySelector(".messageNick > span")).toContainHTML("Ernie");
  expect(container).toContainHTML("Hello there");
});

test("renders a system message", () => {
  const { container } = render(
    <Message message={
      {
        content: "Danger, Will Robinson!",
        type: "system"
      }
    } />
  );
  expect(container.querySelector(".messageNick > span")).toBeEmptyDOMElement();
  expect(container.querySelector(".messageContent.message-system")).toContainHTML("Danger, Will Robinson!");
});

test("renders an error message", () => {
  const { container } = render(
    <Message message={
      {
        content: "Danger, Will Robinson!",
        type: "error"
      }
    } />
  );
  expect(container.querySelector(".messageNick > span")).toBeEmptyDOMElement();
  expect(container.querySelector(".messageContent.message-error")).toContainHTML("Danger, Will Robinson!");
});

test("renders an emote message", () => {
  const { container } = render(
    <Message message={
      {
        sender: "Bert",
        content: "presents with confidence",
        type: "emote"
      }
    } />
  );
  expect(container.querySelector(".messageNick > span")).toContainHTML("Bert");
  expect(container.querySelector(".messageContent.message-emote")).toContainHTML("presents with confidence");
});

test("renders an outgoing private message", () => {
  const { container } = render(
    <Message message={
      {
        sender: "Ernie",
        recipient: "Bert",
        content: "Heeeeeeey, Bert!",
        type: "priv_out"
      }
    } />
  );
  expect(container.querySelector(".messageNick > span")).toContainHTML("Ernie");
  expect(container.querySelector(".messageIndicator")).toContainHTML("Bert");
  expect(container.querySelector(".messageContent.message-priv_out")).toContainHTML("Heeeeeeey, Bert!");
});

test("renders an incoming private message", () => {
  const { container } = render(
    <Message message={
      {
        sender: "Ernie",
        recipient: "Bert",
        content: "Heeeeeeey, Bert!",
        type: "priv_in"
      }
    } />
  );
  expect(container.querySelector(".messageNick > span")).toContainHTML("Ernie");
  expect(container.querySelector(".messageIndicator")).toContainHTML("you");
  expect(container.querySelector(".messageContent.message-priv_in")).toContainHTML("Heeeeeeey, Bert!");
});
