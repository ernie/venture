import React from "react";
import PropTypes from "prop-types";

import MessageStore from "../../stores/MessageStore";
import ChatActions from "../../actions/ChatActions";

import NickRecord from "../../records/Nick";

function getState() {
  return {
    history: MessageStore.getHistory(),
    message: MessageStore.getMessage(),
    index: -1
  }
}

interface MessageFormProps {
  channel: Object;
  nick: NickRecord;
  active: boolean;
}

export default class MessageForm extends React.Component<MessageFormProps> {
  input: React.RefObject<HTMLInputElement>;

  static propTypes = {
    channel: PropTypes.object.isRequired,
    nick: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired
  }

  constructor(props: MessageFormProps) {
    super(props);
    this.input = React.createRef();
  }

  state = getState();

  componentDidMount() {
    MessageStore.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    MessageStore.removeChangeListener(this.handleChange);
  }

  handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let index = this.state.index;
    switch(e.key) {
      case "ArrowUp":
        e.stopPropagation();
        if (index + 1 < this.state.history.length) {
          this.setState({
            index: index + 1,
            message: this.state.history[index + 1]
          });
        }
        break;
      case "ArrowDown":
        e.stopPropagation();
        if (index - 1 < 0) {
          this.setState({
            index: -1,
            message: ''
          });
        } else {
          this.setState({
            index: index - 1,
            message: this.state.history[index - 1]
          });
        }
        break;
      default:
    }
  }

  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ message: e.target.value });
  }

  handleChange = () => {
    this.setState(getState());
  }

  handleSubmit = (e: React.UIEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (this.props.active) {
      ChatActions.sendMessage(this.props.channel, this.state.message.trim());
    }
  }

  editNick = () => {
    ChatActions.editNick();
  }

  componentDidUpdate() {
    this.input.current.focus();
  }

  render() {
    return (
      <div className="messageFormInputs">
        <button
          className="nickButton"
          onClick={this.props.active ? this.editNick : null}
          title={this.props.nick.name}
        >
          <span>{ this.props.nick.name }</span>
        </button>
        <form
          className="messageForm"
          onSubmit={this.handleSubmit}
        >
          <input
            autoFocus
            name="input"
            onChange={this.props.active ? this.handleInput : null}
            onKeyDown={this.props.active ? this.handleKeyPress : null}
            placeholder="Message"
            readOnly={!this.props.active}
            ref={this.input}
            tabIndex={-1}
            value={this.state.message}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }

}
