import React from 'react';
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

export default class ChatSlide extends React.Component<ChatSlideProps> {

  static propTypes = {
    content: PropTypes.string.isRequired,
    active: PropTypes.bool
  }

  static defaultProps = {
    active: true
  }

  state = getState();

  componentDidMount() {
    ChatStore.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    ChatStore.removeChangeListener(this.handleChange);
  }

  handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
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

  handleChange = () => {
    this.setState(getState());
  }

  render() {
    return (
      <div
        className="content chatSlide"
        onKeyDown={this.props.active ? this.handleKeyPress : null}
        ref="content"
      >
        <MessageList messages={this.state.messages} />
        <NickList
          active={this.props.active}
          nicks={this.state.nicks}
        />
        <ChatInput
          active={this.props.active}
          channel={this.state.channel}
          editing={this.state.editing}
          nick={this.state.nick}
        />
      </div>
    );
  }

}
