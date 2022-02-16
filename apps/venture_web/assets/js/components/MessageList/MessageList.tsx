import Immutable from "immutable";

import React from "react";
import PropTypes from "prop-types";

import Message from "../Message/Message";
import MessageRecord from "../../records/Message";

interface MessageListProps {
  messages: Immutable.List<MessageRecord>;
}

export default class MessageList extends React.Component<MessageListProps> {
  messages: React.RefObject<HTMLDivElement>
  autoScrolling = false;
  userScrolling = false;

  static propTypes = {
    messages: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor(props: MessageListProps) {
    super(props);
    this.messages = React.createRef();
  }


  renderMessage(message: MessageRecord, index: number) {
    return (
      <Message
        key={index}
        message={message}
      />
    );
  }

  scrolled = () => {
    let msgs = this.messages.current;
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
      this.messages.current.scrollTop = this.messages.current.scrollHeight;
      this.autoScrolling = false;
    }
  }

  render() {
    return (
      <div
        className="messages"
        onScroll={this.scrolled}
        ref={this.messages}
      >
        <div className="messageList">
          {this.props.messages.map(this.renderMessage)}
        </div>
      </div>
    );
  }

}
