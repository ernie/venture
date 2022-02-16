import React from "react";
import PropTypes from "prop-types";
import SessionActions from "../../actions/SessionActions";

interface TokenRequesterProps {
  didRequestToken: boolean;
}

export default class TokenRequester extends React.Component<TokenRequesterProps> {
  form:           React.RefObject<HTMLFormElement>;
  presenterLink:  React.RefObject<HTMLParagraphElement>;
  token:          React.RefObject<HTMLInputElement>;

  constructor(props: TokenRequesterProps) {
    super(props);
    this.form = React.createRef();
    this.presenterLink = React.createRef();
    this.token = React.createRef();
  }

  static propTypes = {
    didRequestToken: PropTypes.bool.isRequired
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    SessionActions.setToken(this.token.current.value);
    this.token.current.value = "";
  }

  handleSkip(e: React.UIEvent<HTMLAnchorElement>) {
    e.preventDefault();
    SessionActions.skipToken();
  }

  showForm = (e: React.UIEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    this.presenterLink.current.style.display = "none";
    this.form.current.style.display = "block";
    this.token.current.focus();
  }

  render() {
    if (this.props.didRequestToken) {
      return false;
    } else {
      return (
        <div className="tokenRequester">
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
            className="tokenForm"
            onSubmit={this.handleSubmit}
            ref={this.form}
          >
            <input
              name="token"
              placeholder="Presenter Token"
              ref={this.token}
              type="password"
            />
            <button type="submit">Present</button>
          </form>
        </div>
      );
    }
  }

}
