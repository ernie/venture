import React from "react";
import PropTypes from "prop-types";

import MessageRecord from "../../records/Message";

import classNames from "classnames";

interface MessageProps {
  message: MessageRecord;
}

const Message = ({ message }: MessageProps) => {

  const privmsgIndicator = () => {
    switch(message.type) {
      case "priv_in":
        return (
          <div className="messageIndicator">
            &rarr; you
          </div>
        );
      case "priv_out":
        return (
          <div className="messageIndicator">
            &rarr; {message.recipient}
          </div>
        );
      default:
    }
  }

  return (
    <div className="message">
      <div className="messageNick" title={message.sender}><span>{message.sender}</span></div>
      <div className={classNames("messageContent", "message-" + message.type)}>
        {privmsgIndicator()}
        {message.content}
      </div>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.instanceOf(MessageRecord).isRequired
}

export default Message;
