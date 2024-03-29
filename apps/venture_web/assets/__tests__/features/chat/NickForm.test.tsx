import React from "react";
import { fireEvent } from "@testing-library/react";
import { setNick } from "js/features/chat/chatSlice";
import NickForm from "js/features/chat/NickForm";

const store = useStore({ mockDispatch: true });

test("prefills with current nick", () => {
  render(<NickForm active={true} nick="Ernie" />);
  expect(document.getElementsByClassName("nickInput")[0].getAttribute("value")).toEqual("Ernie");
});

test("sets nick when submitted", () => {
  render(<NickForm active={true} nick="Ernie" />);
  const nickForm = document.getElementsByClassName("nickForm")[0];
  const nickInput = document.getElementsByClassName("nickInput")[0];
  fireEvent.change(nickInput, { target: { value: "Bert" } });
  fireEvent.submit(nickForm);
  expect(store.dispatch).toBeCalledWith(setNick("Bert"));
});

test("doesn't set nick when inactive", () => {
  render(<NickForm active={false} nick="Ernie" />);
  const nickForm = document.getElementsByClassName("nickForm")[0];
  fireEvent.submit(nickForm);
  expect(store.dispatch).not.toBeCalled();
});
