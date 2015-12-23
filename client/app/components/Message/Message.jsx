import styles from './_Message.scss';

import React, { PropTypes } from 'react';

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
          <div className={styles.indicator}>
            &rarr; you
          </div>
        );
        break;
      case 'priv_out':
        return (
          <div className={styles.indicator}>
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
      <div className={styles.message}>
        <div className={styles.nick} title={message.sender}><span>{message.sender}</span></div>
        <div className={classNames(styles.content, styles[message.type])}>
          {this.privmsgIndicator()}
          {message.content}
        </div>
      </div>
    );
  }

}
