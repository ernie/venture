import React from 'react';
import PropTypes from 'prop-types';
import SessionActions from '../../actions/SessionActions';

export default class TokenRequester extends React.Component {

  static propTypes = {
    didRequestToken: PropTypes.bool.isRequired
  }

  handleSubmit = (e) => {
    e.preventDefault();
    SessionActions.setToken(this.refs.token.value);
    this.refs.token.value = '';
  }

  handleSkip(e) {
    e.preventDefault();
    SessionActions.skipToken();
  }

  showForm = (e) => {
    e.preventDefault();
    this.refs.presenterLink.style.display = 'none';
    this.refs.form.style.display = 'block';
    this.refs.token.focus();
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
            ref="presenterLink"
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
            ref="form"
          >
            <input
              name="token"
              placeholder="Presenter Token"
              ref="token"
              type="password"
            />
            <button type="submit">Present</button>
          </form>
        </div>
      );
    }
  }

}
