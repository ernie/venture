import React from "react";
import PropTypes from "prop-types";
import SessionActions from "../../actions/SessionActions";

interface KeyRequesterProps {
  didRequestKey: boolean;
}

export default class KeyRequester extends React.Component<KeyRequesterProps> {
  form:           React.RefObject<HTMLFormElement>;
  presenterLink:  React.RefObject<HTMLParagraphElement>;
  key:            React.RefObject<HTMLInputElement>;

  constructor(props: KeyRequesterProps) {
    super(props);
    this.form = React.createRef();
    this.presenterLink = React.createRef();
    this.key = React.createRef();
  }

  static propTypes = {
    didRequestKey: PropTypes.bool.isRequired
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    SessionActions.setKey(this.key.current.value);
    this.key.current.value = "";
  }

  handleSkip(e: React.UIEvent<HTMLAnchorElement>) {
    e.preventDefault();
    SessionActions.skipKey();
  }

  showForm = (e: React.UIEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    this.presenterLink.current.style.display = "none";
    this.form.current.style.display = "block";
    this.key.current.focus();
  }

  render() {
    if (this.props.didRequestKey) {
      return false;
    } else {
      return (
        <div className="keyRequester">
          <p className="attendeeLink">
            <a href="#" onClick={this.handleSkip}>I'm an attendee!</a>
          </p>
          <p
            className="presenterLink"
            ref={this.presenterLink}
          >
            <a
              href="#"
              onClick={this.showForm}
            >
              I'm just the presenter
            </a>
          </p>
          <form
            className="keyForm"
            onSubmit={this.handleSubmit}
            ref={this.form}
          >
            <input
              name="key"
              placeholder="Presenter Key"
              ref={this.key}
              type="password"
            />
            <button type="submit">Present</button>
          </form>
        </div>
      );
    }
  }

}
