import React from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import NickForm from "../NickForm/NickForm";
import MessageForm from "../MessageForm/MessageForm";

import NickRecord from "../../records/Nick";

interface ChatInputProps {
  active: boolean;
  nick: NickRecord;
  channel: Channel;
  editing: boolean;
}

const ChatInput = ({ active, nick, channel, editing}: ChatInputProps) => {

  if (editing) {
    return (
      <div className="chatInput">
        <NickForm
          active={active}
          channel={channel}
          nick={nick}
        />
      </div>
    );
  } else {
    return (
      <div className="chatInput">
        <MessageForm
          active={active}
          channel={channel}
          nick={nick}
        />
      </div>
    );
  }

}

ChatInput.propTypes = {
  active: PropTypes.bool.isRequired,
  nick: PropTypes.object.isRequired,
  channel: PropTypes.object,
  editing: PropTypes.bool.isRequired
}

export default ChatInput;
