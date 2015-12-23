import styles from './_ChatSlide.scss';

import React, { PropTypes } from 'react';
import ChatActions from '../../actions/ChatActions';
import ChatStore from '../../stores/ChatStore';

import classNames from 'classnames';

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

export default class ChatSlide extends React.Component {

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

  handleKeyPress = (e) => {
    switch(e.keyCode) {
      case 33: // Page up
      case 34: // Page down
      case 27:  // Escape
      case 116: // F5
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
        className={classNames('content', styles.chatSlide)}
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
