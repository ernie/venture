import styles from './_ChatInput.scss';

import React, { PropTypes } from 'react';
import ChatActions from '../../actions/ChatActions';

import NickForm from '../NickForm/NickForm';
import MessageForm from '../MessageForm/MessageForm';

export default class ChatSlide extends React.Component {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    nick: PropTypes.object.isRequired,
    channel: PropTypes.object,
    editing: PropTypes.bool.isRequired
  }

  render() {
    if (this.props.editing) {
      return (
        <div className={styles.input}>
          <NickForm
            active={this.props.active}
            channel={this.props.channel}
            nick={this.props.nick}
          />
        </div>
      );
    } else {
      return (
        <div className={styles.input}>
          <MessageForm
            active={this.props.active}
            channel={this.props.channel}
            nick={this.props.nick}
          />
        </div>
      );
    }
  }

}
