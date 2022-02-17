import React from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import ChatActions from "../../actions/ChatActions";

import NickRecord from "../../records/Nick";

interface NickFormProps {
  channel:  Channel;
  nick:     NickRecord;
  active:   boolean;
}

export default class NickForm extends React.Component<NickFormProps> {
  input: React.RefObject<HTMLInputElement>;

  static propTypes = {
    channel: PropTypes.object,
    nick: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired
  }

  constructor(props: NickFormProps) {
    super(props);
    this.input = React.createRef();
  }

  state = { name: this.props.nick.name || "" };

  componentDidMount() {
    this.input.current.focus();
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
        className="nickForm"
        onSubmit={this.handleSubmit}
      >
        <input
          name="input"
          onChange={this.props.active ? this.handleInput : null}
          placeholder="Nickname"
          readOnly={!this.props.active}
          ref={this.input}
          tabIndex={-1}
          value={this.state.name}
        />
        <button
          className="nickSetButton"
          type="submit"
        >
          Set Nick
        </button>
      </form>
    );
  }

}
