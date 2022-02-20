import React, { useRef, useState, useEffect, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import MessageStore from "../../stores/MessageStore";
import ChatActions from "../../actions/ChatActions";

import NickRecord from "../../records/Nick";

function getState() {
  return {
    history: MessageStore.getHistory(),
    message: MessageStore.getMessage(),
    index: -1
  }
}

interface MessageFormProps {
  channel: Channel;
  nick: NickRecord;
  active: boolean;
}

const MessageForm = ({ channel, nick, active}: MessageFormProps) => {
  const input = useRef(null);
  const [state, setState] = useState(getState);
  useLayoutEffect(() => {
    MessageStore.addChangeListener(handleChange);
    return () => {
      MessageStore.removeChangeListener(handleChange);
    };
  }, []);
  useEffect(() => {
    input.current.focus();
  });

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let index = state.index;
    switch(e.key) {
      case "ArrowUp":
        e.stopPropagation();
        if (index + 1 < state.history.length) {
          setState({
            index: index + 1,
            message: state.history[index + 1],
            history: state.history
          });
        }
        break;
      case "ArrowDown":
        e.stopPropagation();
        if (index - 1 < 0) {
          setState({
            index: -1,
            message: '',
            history: state.history
          });
        } else {
          setState({
            index: index - 1,
            message: state.history[index - 1],
            history: state.history
          });
        }
        break;
      default:
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      message: e.currentTarget.value,
      index: state.index,
      history: state.history
    });
  }

  const handleChange = () => {
    setState(getState);
  }

  const handleSubmit = (e: React.UIEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (active) {
      ChatActions.sendMessage(channel, state.message.trim());
    }
  }

  const editNick = () => {
    ChatActions.editNick();
  }

  return (
    <div className="messageFormInputs">
      <button
        className="nickButton"
        onClick={active ? editNick : null}
        title={nick.name}
      >
        <span>{ nick.name }</span>
      </button>
      <form
        className="messageForm"
        onSubmit={handleSubmit}
      >
        <input
          autoFocus
          name="input"
          onChange={active ? handleInput : null}
          onKeyDown={active ? handleKeyPress : null}
          placeholder="Message"
          readOnly={!active}
          ref={input}
          tabIndex={-1}
          value={state.message}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );

}

MessageForm.propTypes = {
  channel: PropTypes.instanceOf(Channel),
  nick: PropTypes.instanceOf(NickRecord).isRequired,
  active: PropTypes.bool.isRequired
}

export default MessageForm;
