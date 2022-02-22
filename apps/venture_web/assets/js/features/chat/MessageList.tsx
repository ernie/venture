import React, { useRef, useState, useEffect } from "react";

import Message from "./Message";
import { Message as MessageState } from "./chatSlice";
interface MessageListProps {
  messages: Array<MessageState>;
}

const MessageList = ({ messages }: MessageListProps) => {
  const messagesDiv = useRef(null);
  const [userScrolling, setUserScrolling] = useState(false);

  useEffect(() => {
    if (!userScrolling) {
      messagesDiv.current.scrollTop = messagesDiv.current.scrollHeight;
    }
  }, [messages, userScrolling]);

  const renderMessage = (message: MessageState, index: number) => {
    return (
      <Message
        key={index}
        message={message}
      />
    );
  }

  const scrolled = () => {
    let msgs = messagesDiv.current;
    if (msgs.scrollTop < (msgs.scrollHeight - (msgs.clientHeight + 5))) {
      setUserScrolling(true);
    } else {
      setUserScrolling(false);
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
