import Immutable from 'immutable';

import React from 'react';
import PropTypes from 'prop-types';

import Message from '../Message/Message';

export default class MessageList extends React.Component {

  static propTypes = {
    messages: PropTypes.instanceOf(Immutable.List).isRequired
  }

  autoScrolling = false;
  userScrolling = false;

  renderMessage(message, index) {
    return (
      <Message
        key={index}
        message={message}
      />
    );
  }

  scrolled = () => {
    let msgs = this.refs.messages;
    if (!this.autoScrolling) {
      if (msgs.scrollTop < (msgs.scrollHeight - (msgs.clientHeight + 5))) {
        this.userScrolling = true;
      } else {
        this.userScrolling = false;
      }
    }
  }

  componentDidUpdate() {
    if (!this.userScrolling) {
      this.autoScrolling = true;
      this.refs.messages.scrollTop = this.refs.messages.scrollHeight;
      this.autoScrolling = false;
    }
  }

  render() {
    return (
      <div
        className="messages"
        onScroll={this.scrolled}
        ref="messages"
      >
        <div className="messageList">
          {this.props.messages.map(this.renderMessage)}
        </div>
      </div>
    );
  }

}
