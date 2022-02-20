import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import ChatActions from "../../actions/ChatActions";

import NickRecord from "../../records/Nick";

interface NickFormProps {
  channel:  Channel;
  nick:     NickRecord;
  active:   boolean;
}

const NickForm = ({ channel, active, nick = new NickRecord({ id: "", name: "" }) }: NickFormProps) => {
  const input = useRef(null);
  const [state, setState] = useState({ name: nick.name });
  useEffect(() => {
    input.current.focus();
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ name: e.currentTarget.value });
  }

  const handleSubmit = (e: React.UIEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (active) {
      ChatActions.setNick(channel, state.name.trim());
    }
  }

  return (
    <form
      className="nickForm"
      onSubmit={handleSubmit}
    >
      <input
        name="input"
        onChange={active ? handleInput : null}
        placeholder="Nickname"
        readOnly={!active}
        ref={input}
        tabIndex={-1}
        value={state.name}
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

NickForm.propTypes = {
  channel: PropTypes.object,
  nick: PropTypes.object.isRequired,
  active: PropTypes.bool.isRequired
}

export default NickForm;
