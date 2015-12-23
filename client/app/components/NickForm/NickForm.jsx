import styles from './_NickForm.scss';

import React, { PropTypes } from 'react';

import ChatActions from '../../actions/ChatActions';

export default class NickForm extends React.Component {

  static propTypes = {
    channel: PropTypes.object,
    nick: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired
  }

  state = { name: this.props.nick.name };

  componentDidMount() {
    this.refs.input.focus();
  }

  handleInput = (e) => {
    this.setState({ name: e.target.value });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.props.active) {
      ChatActions.setNick(this.props.channel, this.state.name.trim());
    }
  }

  render() {
    return (
      <form
        className={styles.nickForm}
        onSubmit={this.handleSubmit}
      >
        <input
          name="input"
          onChange={this.props.active ? this.handleInput : null}
          placeholder="Nickname"
          readOnly={!this.props.active}
          ref="input"
          tabIndex="-1"
          value={this.state.name}
        />
        <button
          className={styles.setButton}
          type="submit"
        >
          Set Nick
        </button>
      </form>
    );
  }

}
