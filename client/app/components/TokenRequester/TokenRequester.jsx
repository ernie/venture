import styles from './_TokenRequester.scss';

import React, { PropTypes } from 'react';
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
        <div className={styles.requester}>
          <p className={styles.attendeeLink}>
            <a href="#" onClick={this.handleSkip}>I'm an attendee!</a>
          </p>
          <p
            className={styles.presenterLink}
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
            className={styles.form}
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
