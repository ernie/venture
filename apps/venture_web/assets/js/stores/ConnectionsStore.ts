import AppDispatcher, { Action } from "../dispatcher/AppDispatcher";
import SessionConstants from "../constants/SessionConstants";
import ConnectionConstants from "../constants/ConnectionConstants";
import { EventEmitter } from "events";

interface Connections {
  presenters:  number;
  attendees:   number;
}


class ConnectionStore extends EventEmitter {
  dispatchToken?: string;
  connections: {
    presenters: number;
    attendees: number;
  };

  constructor() {
    super();
    this.connections = { presenters: 0, attendees: 0 };
  }

  get(): Connections {
    return this.connections;
  }

  emitChange() {
    this.emit(ConnectionConstants.CONNECTIONS_UPDATED);
  }

  addChangeListener(callback: () => void) {
    this.on(ConnectionConstants.CONNECTIONS_UPDATED, callback);
  }

  removeChangeListener(callback: () => void) {
    this.removeListener(ConnectionConstants.CONNECTIONS_UPDATED, callback);
  }
}

let store = new ConnectionStore();

store.dispatchToken = AppDispatcher.register((action: Action) => {
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
