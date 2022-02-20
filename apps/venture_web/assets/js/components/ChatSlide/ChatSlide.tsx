import React, { useRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import ChatStore from '../../stores/ChatStore';

import ChatInput from '../ChatInput/ChatInput';
import MessageList from '../MessageList/MessageList';
import NickList from '../NickList/NickList';

function getState() {
  return {
    editing: ChatStore.isEditing(),
    channel: ChatStore.getChannel(),
    nick: ChatStore.getNick(),
    nicks: ChatStore.getNicks(),
    messages: ChatStore.getMessages()
  };
}

interface ChatSlideProps {
  content: string;
  active:  boolean;
}

const ChatSlide = ({ active = true }: ChatSlideProps) => {
  const contentDiv = useRef(null);
  const [state, setState] = useState(getState);

  const handleChange = () => {
    setState(getState);
  }

  useLayoutEffect(() => {
    ChatStore.addChangeListener(handleChange);
    return () => {
      ChatStore.removeChangeListener(handleChange);
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
      ref={contentDiv}
    >
      <MessageList messages={state.messages} />
      <NickList
        active={active}
        nicks={state.nicks}
      />
      <ChatInput
        active={active}
        channel={state.channel}
        editing={state.editing}
        nick={state.nick}
      />
    </div>
  );

}

ChatSlide.propTypes = {
  content: PropTypes.string.isRequired,
  active: PropTypes.bool
}

export default ChatSlide;
