import React from "react";
import PropTypes from "prop-types";

import ChatActions from "../../actions/ChatActions";

import NickRecord from "../../records/Nick";

interface NickListProps {
  nicks:   Array<NickRecord>;
  active:  boolean;
}

const NickList = ({nicks, active}: NickListProps) => {

  const nickClicked = (e: React.UIEvent<HTMLDivElement>) => {
    ChatActions.nickClicked((e.target as HTMLDivElement).innerText);
  }

  const renderNick = (nick: NickRecord, index: number) => {
    return (
      <div
        className="nick"
        key={index}
        onClick={active ? nickClicked : null}
        title={nick.name}
      >
        <span>{nick.name}</span>
      </div>
    );
  }

  const lurkers = (count: number) => {
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

  let named = [];
  let anonymousCount = 0;
  nicks.forEach(
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
      {lurkers(anonymousCount)}
      <div className="nicks">
        {named.map(renderNick)}
      </div>
    </div>
  );

}

NickList.propTypes = {
  nicks: PropTypes.array.isRequired,
  active: PropTypes.bool.isRequired
}

export default NickList;
