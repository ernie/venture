import React from 'react';
import { useAppSelector } from "../../hooks";
import { selectConnections } from "./presentationSlice";

const ConnectionsDisplay = () => {
  const { presenters, attendees } = useAppSelector(selectConnections);

  return (
    <dl className="connections">
      <dt>Presenters:</dt><dd>{presenters}</dd>
      <dt>Attendees:</dt><dd>{attendees}</dd>
    </dl>
  );
}

export default ConnectionsDisplay;
