import React from 'react';
import ConnectionsStore from '../../stores/ConnectionsStore';

function getState() {
  return ConnectionsStore.get();
}

export default class ConnectionsDisplay extends React.Component {

  state = getState();

  componentDidMount() {
    ConnectionsStore.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    ConnectionsStore.removeChangeListener(this.handleChange);
  }

  handleChange = () => {
    this.setState(getState());
  }

  render() {
    return (
      <dl className="connections">
        <dt>Presenters:</dt><dd>{this.state.presenters}</dd>
        <dt>Attendees:</dt><dd>{this.state.attendees}</dd>
      </dl>
    );
  }
}
