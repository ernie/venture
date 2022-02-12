import React from 'react';
import PropTypes from 'prop-types';

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
        <div className="chatInput">
          <NickForm
            active={this.props.active}
            channel={this.props.channel}
            nick={this.props.nick}
          />
        </div>
      );
    } else {
      return (
        <div className="chatInput">
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
