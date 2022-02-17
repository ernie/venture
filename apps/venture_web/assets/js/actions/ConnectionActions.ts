import AppDispatcher from '../dispatcher/AppDispatcher';

import ConnectionConstants from '../constants/ConnectionConstants';

interface Connections {
  presenters:  number;
  attendees:   number;
}

export default {

  receiveConnections(data: Connections) {
    AppDispatcher.dispatch({
      actionType: ConnectionConstants.CONNECTIONS_RECEIVED,
      data: data
    });
  }

};
