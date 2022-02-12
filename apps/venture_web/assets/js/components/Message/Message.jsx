import React from 'react';
import PropTypes from 'prop-types';

import MessageRecord from '../../records/Message';

import classNames from 'classnames';

export default class Message extends React.Component {

  static propTypes = {
    message: PropTypes.instanceOf(MessageRecord).isRequired
  }

  privmsgIndicator = () => {
    let message = this.props.message;
    switch(message.type) {
      case 'priv_in':
        return (
          <div className="messageIndicator">
            &rarr; you
          </div>
        );
        break;
      case 'priv_out':
        return (
          <div className="messageIndicator">
            &rarr; {message.recipient}
          </div>
        );
        break;
      default:
    }
  }

  render() {
    let message = this.props.message;
    return (
      <div className="message">
        <div className="messageNick" title={message.sender}><span>{message.sender}</span></div>
        <div className={classNames("messageContent", "message-" + message.type)}>
          {this.privmsgIndicator()}
          {message.content}
        </div>
      </div>
    );
  }

}
