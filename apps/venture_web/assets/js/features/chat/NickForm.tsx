import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch } from "../../hooks";

import { setNick } from "./chatSlice";

interface NickFormProps {
  nick?:     string;
  active:   boolean;
}

const NickForm = ({ active, nick }: NickFormProps) => {
  const input = useRef(null);
  const dispatch = useAppDispatch();
  const [nickInput, setNickInput] = useState(nick);

  useEffect(() => {
    input.current.focus();
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNickInput(e.currentTarget.value);
  }

  const handleSubmit = (e: React.UIEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (active) {
      dispatch(setNick(nickInput.trim()));
      setNickInput("");
    }
  }

  return (
    <form
      className="nickForm"
      onSubmit={active ? handleSubmit : null}
    >
      <input
        className="nickInput"
        name="input"
        onChange={active ? handleInput : null}
        placeholder="Nickname"
        readOnly={!active}
        ref={input}
        tabIndex={-1}
        value={nickInput}
      />
      <button
        className="nickSetButton"
        type="submit"
      >
        Set Nick
      </button>
    </form>
  );

}

export default NickForm;
