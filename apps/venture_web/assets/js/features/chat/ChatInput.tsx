import React from "react";

import NickForm from "./NickForm";
import MessageForm from "./MessageForm";

interface ChatInputProps {
  active: boolean;
  nick: string;
  editingNick: boolean;
}

const ChatInput = ({ active, nick, editingNick }: ChatInputProps) => {

  return (
    <div id="chatInput">
      {
        editingNick ?
          <NickForm
            active={active}
            nick={nick}
          /> :
          <MessageForm
            active={active}
            nick={nick}
          />
      }
    </div>
  );

}

export default ChatInput;
