import AppDispatcher from '../dispatcher/AppDispatcher';

import ConnectionConstants from '../constants/ConnectionConstants';

export default {

  receiveConnections(data) {
    AppDispatcher.dispatch({
      actionType: ConnectionConstants.CONNECTIONS_RECEIVED,
      data: data
    });
  }

};
