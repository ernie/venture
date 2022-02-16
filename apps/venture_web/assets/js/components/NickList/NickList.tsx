import React from "react";
import PropTypes from "prop-types";

import ChatActions from "../../actions/ChatActions";

import NickRecord from "../../records/Nick";

interface NickListProps {
  nicks:   Array<NickRecord>;
  active:  boolean;
}

export default class NickList extends React.Component<NickListProps> {

  static propTypes = {
    nicks: PropTypes.array.isRequired,
    active: PropTypes.bool.isRequired
  }

  nickClicked = (e: React.UIEvent<HTMLDivElement>) => {
    ChatActions.nickClicked((e.target as HTMLDivElement).innerText);
  }

  renderNick = (nick: NickRecord, index: number) => {
    return (
      <div
        className="nick"
        key={index}
        onClick={this.props.active ? this.nickClicked : null}
        title={nick.name}
      >
        <span>{nick.name}</span>
      </div>
    );
  }

  lurkers(count: number) {
    switch(count) {
      case 0:
        return false;
      case 1:
        return (
          <div className="lurkers">1 lurker</div>
        );
      default:
        return (
          <div className="lurkers">{count} lurkers</div>
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
      <div className="nickList">
        <div className="nickListHeader">Who's here?</div>
        {this.lurkers(anonymousCount)}
        <div className="nicks">
          {named.map(this.renderNick)}
        </div>
      </div>
    );
  }

}
