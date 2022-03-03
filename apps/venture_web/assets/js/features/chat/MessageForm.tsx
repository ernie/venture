import React, { useRef, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { selectHistory, selectPrefilledMessage, sendMessage, editNick } from "./chatSlice";

interface MessageFormProps {
  nick: string;
  active: boolean;
}

const MessageForm = ({ nick, active}: MessageFormProps) => {
  const input = useRef(null);
  const dispatch = useAppDispatch();
  const prefilledMessage = useAppSelector(selectPrefilledMessage);
  const history = useAppSelector(selectHistory);
  const [state, setState] = useState({ historyIndex: -1, message: prefilledMessage });

  useEffect(() => {
    setState({
      message: prefilledMessage,
      historyIndex: -1
    });
    input.current.focus();
  }, [prefilledMessage]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let index = state.historyIndex;
    switch(e.key) {
      case "ArrowUp":
        e.stopPropagation();
        if (index + 1 < history.length) {
          setState({
            historyIndex: index + 1,
            message: history[index + 1]
          });
        }
        break;
      case "ArrowDown":
        e.stopPropagation();
        if (index - 1 < 0) {
          setState({
            historyIndex: -1,
            message: ""
          });
        } else {
          setState({
            historyIndex: index - 1,
            message: history[index - 1]
          });
        }
        break;
      default:
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      message: e.currentTarget.value,
      historyIndex: state.historyIndex
    });
  }

  const handleSubmit = (e: React.UIEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState({ message: "", historyIndex: -1 });
    if (active) {
      dispatch(sendMessage(state.message.trim()));
    }
  }

  const editNickClicked = () => {
    dispatch(editNick());
  }

  return (
    <div className="messageFormInputs">
      <button
        id="nickButton"
        onClick={active ? editNickClicked : null}
        title={nick}
      >
        <span>{ nick }</span>
      </button>
      <form
        id="messageForm"
        onSubmit={active ? handleSubmit : null}
      >
        <input
          id="messageInput"
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
        <button id="messageSendButton" type="submit">Send</button>
      </form>
    </div>
  );

}

export default MessageForm;
