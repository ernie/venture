import styles from './_NickList.scss';

import React, { PropTypes } from 'react';

import ChatActions from '../../actions/ChatActions';

import classNames from 'classnames';

export default class Message extends React.Component {

  static propTypes = {
    nicks: PropTypes.array.isRequired,
    active: PropTypes.bool.isRequired
  }

  nickClicked = (e) => {
    ChatActions.nickClicked(e.target.innerText);
  }

  renderNick = (nick, index) => {
    return (
      <div
        className={styles.nick}
        key={index}
        onClick={this.props.active ? this.nickClicked : null}
        title={nick.name}
      >
        <span>{nick.name}</span>
      </div>
    );
  }

  lurkers(count) {
    switch(count) {
      case 0:
        return false;
        break;
      case 1:
        return (
          <div className={styles.lurkers}>1 lurker</div>
        );
        break;
      default:
        return (
          <div className={styles.lurkers}>{count} lurkers</div>
        );
    }
  }

  render() {
    let named = [];
    let anonymousCount = 0;
    this.props.nicks.forEach(
      (nick) => {
        if (nick.name) {
          named.push(nick);
        } else {
          anonymousCount++;
        }
      }
    )
    return (
      <div className={styles.nickList}>
        <div className={styles.header}>Who's here?</div>
        {this.lurkers(anonymousCount)}
        <div className={styles.nicks}>
          {named.map(this.renderNick)}
        </div>
      </div>
    );
  }

}
