import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from "../../hooks";
import {
  join, leave, selectEditingNick, selectNick, selectNicks, selectMessages
} from "./chatSlice";

import ChatInput from './ChatInput';
import MessageList from './MessageList';
import NickList from './NickList';

interface ChatSlideProps {
  active:  boolean;
}

const ChatSlide = ({ active = true }: ChatSlideProps) => {
  const dispatch = useAppDispatch();
  const nick = useAppSelector(selectNick);
  const editingNick = useAppSelector(selectEditingNick);
  const nicks = useAppSelector(selectNicks);
  const messages = useAppSelector(selectMessages);

  useEffect(() => {
    dispatch(join());
    return () => {
      dispatch(leave());
    };
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch(e.key) {
      case "PageUp":
      case "PageDown":
      case "Escape":
      case "F5":
        break;
      default:
        e.stopPropagation();
    }
  }

  return (
    <div
      className="content chatSlide"
      onKeyDown={active ? handleKeyPress : null}
    >
      <MessageList messages={messages} />
      <NickList
        active={active}
        nicks={nicks}
      />
      <ChatInput
        active={active}
        nick={nick}
        editingNick={editingNick}
      />
    </div>
  );

}

export default ChatSlide;
