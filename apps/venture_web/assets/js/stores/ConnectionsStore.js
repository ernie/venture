import AppDispatcher from '../dispatcher/AppDispatcher';
import SessionConstants from '../constants/SessionConstants';
import ConnectionConstants from '../constants/ConnectionConstants';
import { EventEmitter } from 'events';

class ConnectionStore extends EventEmitter {

  connections = {};

  get() {
    return this.connections;
  }

  emitChange() {
    this.emit(ConnectionConstants.CONNECTIONS_UPDATED);
  }

  addChangeListener(callback) {
    this.on(ConnectionConstants.CONNECTIONS_UPDATED, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(ConnectionConstants.CONNECTIONS_UPDATED, callback);
  }
}

let store = new ConnectionStore();

store.dispatchToken = AppDispatcher.register((action) => {
  switch(action.actionType) {
    case SessionConstants.CONNECTED:
      if (action.data.connections) {
        store.connections = action.data.connections;
        store.emitChange();
      }
      break;
    case ConnectionConstants.CONNECTIONS_RECEIVED:
      store.connections = action.data;
      store.emitChange();
      break;
    default:
  }
});

export default store;
