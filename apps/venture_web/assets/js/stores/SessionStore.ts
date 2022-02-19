import { EventEmitter } from 'events';
import AppDispatcher, { Action } from '../dispatcher/AppDispatcher';

import SessionActions from '../actions/SessionActions';
import SlideActions from '../actions/SlideActions';
import SelectionActions from '../actions/SelectionActions';
import ConnectionActions from '../actions/ConnectionActions';
import SessionConstants from '../constants/SessionConstants';
import { Socket, Channel } from 'phoenix';

class SessionStore extends EventEmitter {
  dispatchKey: string;
  didConnect: boolean;
  presenter: boolean;
  accessKey: string;
  keyRequested: boolean;
  socket: Socket;
  channel: Channel;

  constructor() {
    super();
    this.didConnect = false;
    this.presenter = false;
    this.accessKey = sessionStorage.getItem('accessKey');
    this.keyRequested = !!sessionStorage.getItem('keyRequested');
    this.configureSocket(this.accessKey);
  }

  didRequestKey() {
    return this.keyRequested ? true : false;
  }

  isPresenter() {
    return this.presenter;
  }

  getAccessKey() {
    return this.accessKey;
  }

  getSocket() {
    return this.socket;
  }

  getChannel() {
    return this.channel;
  }

  configureSocket(key: string) {
    if (!this.keyRequested) {
      return;
    }
    if (key) {
      this.socket = new Socket("/socket", {params: {key: key}});
      this.channel = this.socket.channel('presentation', {});
    } else {
      this.socket = new Socket("/socket");
      this.channel = this.socket.channel('presentation', {});
    }
    this.socket.onError( (_error: () => void) => {
      if (!this.didConnect) {
        this.socket.disconnect();
        this.accessKey = undefined;
        this.keyRequested = false;
        sessionStorage.removeItem('accessKey');
        sessionStorage.removeItem('keyRequested');
        this.emitChange();
      }
    });
    this.socket.onOpen( (_data) => {
      this.didConnect = true;
      this.presenter = key ? true : false;
      if (key) {
        this.accessKey = key;
        sessionStorage.setItem('accessKey', key);
      }
      this.keyRequested = true;
      this.emitChange();
    });
    this.socket.connect();
    this.channel.on("slide", (slide) => {
      SlideActions.receiveSlide(slide);
    });
    this.channel.on("selections", (selections) => {
      SelectionActions.receiveSelections(selections);
    });
    this.channel.on("connections", (connections) => {
      ConnectionActions.receiveConnections(connections);
    });
    this.channel.join()
      .receive('ok', (data) => {
        SessionActions.handleConnection(data);
      });
  }

  emitChange() {
    this.emit(SessionConstants.SESSION_CHANGED);
  }

  addChangeListener(callback: () => void) {
    this.on(SessionConstants.SESSION_CHANGED, callback);
  }

  removeChangeListener(callback: () => void) {
    this.removeListener(SessionConstants.SESSION_CHANGED, callback);
  }
}

let store = new SessionStore();

store.dispatchKey = AppDispatcher.register((action: Action) => {
  switch(action.actionType) {
    case SessionConstants.SET_KEY:
      if (action.data) {
        sessionStorage.setItem('keyRequested', "true");
        store.keyRequested = true;
        store.configureSocket(action.data);
      }
      break;
    case SessionConstants.SKIP_KEY:
      sessionStorage.setItem('keyRequested', "true");
      store.keyRequested = true;
      store.configureSocket(null);
      break;
    default:
  }
});

export default store;
