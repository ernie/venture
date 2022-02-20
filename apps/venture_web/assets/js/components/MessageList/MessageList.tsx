import Immutable from "immutable";

import React, { useRef, useState, useEffect } from "react";

import Message from "../Message/Message";
import MessageRecord from "../../records/Message";

interface MessageListProps {
  messages: Immutable.List<MessageRecord>;
}

const MessageList = ({ messages }: MessageListProps) => {
  const messagesDiv = useRef(null);
  const [state, setState] = useState({ autoScrolling: false, userScrolling: false });

  useEffect(() => {
    if (!state.userScrolling) {
      setState({...state, autoScrolling: true});
      messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
      setState({...state, autoScrolling: false});
    }
  }, [messages, state.userScrolling]);

  const renderMessage = (message: MessageRecord, index: number) => {
    return (
      <Message
        key={index}
        message={message}
      />
    );
  }

  const scrolled = () => {
    let msgs = messagesDiv.current;
    if (!state.autoScrolling) {
      if (msgs.scrollTop < (msgs.scrollHeight - (msgs.clientHeight + 5))) {
        setState({...state, userScrolling: true});
      } else {
        setState({...state, userScrolling: false});
      }
    }
  }

  return (
    <div
      className="messages"
      onScroll={scrolled}
      ref={messagesDiv}
    >
      <div className="messageList">
        {messages.map(renderMessage)}
      </div>
    </div>
  );

}

export default MessageList;
