import React from "react";

import { useAppDispatch } from "../../hooks";
import { prefillDirectMessage } from "./chatSlice";

import { Nick } from "./chatSlice";

interface NickListProps {
  nicks:   Array<Nick>;
  active:  boolean;
}

const NickList = ({nicks, active}: NickListProps) => {
  const dispatch = useAppDispatch();

  const nickClicked = (e: React.UIEvent<HTMLDivElement>) => {
    dispatch(prefillDirectMessage(e.currentTarget.innerText));
  }

  const renderNick = (nick: Nick, index: number) => {
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
        return null;
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

export default NickList;
