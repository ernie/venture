import React, { useState, useLayoutEffect } from 'react';
import ConnectionsStore, { Connections } from '../../stores/ConnectionsStore';

function getState(): Connections {
  return ConnectionsStore.get();
}

const ConnectionsDisplay = () => {
  const [state, setState] = useState(getState);
  useLayoutEffect(() => {
    ConnectionsStore.addChangeListener(handleChange);
    return () => {
      ConnectionsStore.removeChangeListener(handleChange);
    };
  }, []);

  const handleChange = () => {
    setState(getState);
  }

  return (
    <dl className="connections">
      <dt>Presenters:</dt><dd>{state.presenters}</dd>
      <dt>Attendees:</dt><dd>{state.attendees}</dd>
    </dl>
  );
}

export default ConnectionsDisplay;
