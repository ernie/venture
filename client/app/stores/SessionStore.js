import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';

import SessionActions from '../actions/SessionActions';
import SlideActions from '../actions/SlideActions';
import SelectionActions from '../actions/SelectionActions';
import ConnectionActions from '../actions/ConnectionActions';
import AppConstants from '../constants/AppConstants';
import SessionConstants from '../constants/SessionConstants';
import { Socket } from '../phoenix';

const ENDPOINT = `${__PROTOCOL__}${__HOSTNAME__ || window.location.host}${__ROOT__}socket`;

class SessionStore extends EventEmitter {

  constructor(...args) {
    super(...args);
    this.didConnect = false;
    this.presenter = false;
    this.accessToken = sessionStorage.getItem('accessToken');
    this.tokenRequested = sessionStorage.getItem('tokenRequested');
    this.configureSocket(this.accessToken);
  }

  didRequestToken() {
    return this.tokenRequested ? true : false;
  }

  isPresenter() {
    return this.presenter;
  }

  getAccessToken() {
    return this.accessToken;
  }

  getSocket() {
    return this.socket;
  }

  getChannel() {
    return this.channel;
  }

  configureSocket(token) {
    if (!this.tokenRequested) {
      return;
    }
    if (token) {
      this.socket = new Socket(ENDPOINT, {params: {token: token}});
      this.channel = this.socket.channel('presentation:presenter', {});
    } else {
      this.socket = new Socket(ENDPOINT);
      this.channel = this.socket.channel('presentation:attendee', {});
    }
    this.socket.onError( (error) => {
      if (!this.didConnect) {
        this.socket.disconnect();
        this.accessToken = undefined;
        this.tokenRequested = false;
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('tokenRequested');
        this.emitChange();
      }
    });
    this.socket.onOpen( (data) => {
      this.didConnect = true;
      this.presenter = token ? true : false;
      if (token) {
        this.accessToken = token;
        sessionStorage.setItem('accessToken', token);
      }
      this.tokenRequested = true;
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

  addChangeListener(callback) {
    this.on(SessionConstants.SESSION_CHANGED, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(SessionConstants.SESSION_CHANGED, callback);
  }
}

let store = new SessionStore();

store.dispatchToken = AppDispatcher.register((action) => {
  switch(action.actionType) {
    case SessionConstants.SET_TOKEN:
      if (action.data) {
        sessionStorage.setItem('tokenRequested', true);
        store.tokenRequested = true;
        store.configureSocket(action.data);
      }
      break;
    case SessionConstants.SKIP_TOKEN:
      sessionStorage.setItem('tokenRequested', true);
      store.tokenRequested = true;
      store.configureSocket(null);
      break;
    default:
  }
});

export default store;
