import { assert } from 'chai';
import Immutable from 'immutable';
import Nick from '../../records/Nick';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import SessionStore from '../SessionStore';

import SessionConstants from '../../constants/SessionConstants';

class MockChannel {

  channel = '';
  params = {};
  events = {};
  state = 'closed';
  joined = false;
  left = false;

  constructor(channel, params) {
    this.channel = channel;
    this.params = params;
  }

  on(event, handler) {
    this.events[event] = handler;
  }

  onError() { }

  join() {
    this.joined = true;
    this.state = 'joined';
    return {
      receive() { }
    };
  }

  leave() {
    this.state = 'closed';
    this.left = true;
  }

};

class MockSocket {

  errorCallback = undefined;
  openCallback = undefined;
  connected = false;
  disconnected = false;

  constructor(endpoint, params) {
    this.endpoint = endpoint;
    this.params = params;
  }

  channel(channel, params) {
    return new MockChannel(channel, params);
  }

  connect() {
    this.connected = true;
    this.openCallback()
  }

  disconnect() {
    this.connected = false;
  }

  onOpen(callback) {
    this.openCallback = callback;
  }

  onError(callback) {
    this.errorCallback = callback;
  }
}

class ErrorSocket extends MockSocket {

  connect() {
    this.errorCallback()
  }

}

let callback = AppDispatcher._callbacks[SessionStore.dispatchToken];

describe('SessionStore', () => {

  beforeEach( () => {
    AppDispatcher._isDispatching = true;
    sinon.stub(AppDispatcher, 'waitFor');
    SessionStore.channel = undefined;
    SessionStore.tokenRequested = false;
    SessionStore.accessToken = null;
    SessionStore.didConnect = false;
    SessionStore.presenter = false;
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('tokenRequested');
  });

  afterEach( () => {
    AppDispatcher._isDispatching = false;
    AppDispatcher.waitFor.restore();
  });

  describe('without a connection error', () => {

    before( () => {
      SessionStore.__Rewire__('Socket', MockSocket);
    });

    after( () => {
      SessionStore.__ResetDependency__('Socket');
    });

    it('sets a token', () => {
      let listener = sinon.spy();
      SessionStore.addChangeListener(listener);
      callback({
        actionType: SessionConstants.SET_TOKEN,
        data: 'token'
      });
      SessionStore.removeChangeListener(listener);

      let socket = SessionStore.getSocket();
      let channel = SessionStore.getChannel();
      let isPresenter = SessionStore.isPresenter();
      let didRequestToken = SessionStore.didRequestToken();
      let accessToken = SessionStore.getAccessToken();

      assert.isTrue(listener.called);
      assert.equal(
        socket.endpoint, `${__PROTOCOL__}${__HOSTNAME__}${__ROOT__}socket`
      );
      assert.deepEqual(socket.params, {params: {token: 'token'}});
      assert.isTrue(socket.connected);
      assert.equal(channel.channel, 'presentation:presenter');
      assert.deepEqual(channel.params, {});
      assert.isTrue(isPresenter);
      assert.isTrue(didRequestToken);
      assert.equal(accessToken, 'token');
      assert.equal(sessionStorage.getItem('accessToken'), 'token');
      assert.equal(sessionStorage.getItem('tokenRequested'), 'true');
    });

    it('skips a token', () => {
      let listener = sinon.spy();
      SessionStore.addChangeListener(listener);
      callback({
        actionType: SessionConstants.SKIP_TOKEN
      });
      SessionStore.removeChangeListener(listener);

      let socket = SessionStore.getSocket();
      let channel = SessionStore.getChannel();
      let isPresenter = SessionStore.isPresenter();
      let didRequestToken = SessionStore.didRequestToken();
      let accessToken = SessionStore.getAccessToken();

      assert.isTrue(listener.called);
      assert.equal(
        socket.endpoint, `${__PROTOCOL__}${__HOSTNAME__}${__ROOT__}socket`
      );
      assert.isUndefined(socket.params);
      assert.isTrue(socket.connected);
      assert.equal(channel.channel, 'presentation:attendee');
      assert.deepEqual(channel.params, {});
      assert.isFalse(isPresenter);
      assert.isTrue(didRequestToken);
      assert.isNull(accessToken);
      assert.isNull(sessionStorage.getItem('accessToken'));
      assert.equal(sessionStorage.getItem('tokenRequested'), 'true');
    });

  });

  describe('with a connection error', () => {

    before( () => {
      SessionStore.__Rewire__('Socket', ErrorSocket);
    });

    after( () => {
      SessionStore.__ResetDependency__('Socket');
    });

    it('sets a token', () => {
      let listener = sinon.spy();
      SessionStore.addChangeListener(listener);
      callback({
        actionType: SessionConstants.SET_TOKEN,
        data: 'token'
      });
      SessionStore.removeChangeListener(listener);

      let socket = SessionStore.getSocket();
      let channel = SessionStore.getChannel();
      let isPresenter = SessionStore.isPresenter();
      let didRequestToken = SessionStore.didRequestToken();
      let accessToken = SessionStore.getAccessToken();

      assert.isTrue(listener.called);
      assert.equal(
        socket.endpoint, `${__PROTOCOL__}${__HOSTNAME__}${__ROOT__}socket`
      );
      assert.deepEqual(socket.params, {params: {token: 'token'}});
      assert.isFalse(socket.connected);
      assert.equal(channel.channel, 'presentation:presenter');
      assert.deepEqual(channel.params, {});
      assert.isFalse(isPresenter);
      assert.isFalse(didRequestToken);
      assert.isUndefined(accessToken);
      assert.isNull(sessionStorage.getItem('accessToken'));
      assert.isNull(sessionStorage.getItem('tokenRequested'));
    });

    it('skips a token', () => {
      let listener = sinon.spy();
      SessionStore.addChangeListener(listener);
      callback({
        actionType: SessionConstants.SKIP_TOKEN
      });
      SessionStore.removeChangeListener(listener);

      let socket = SessionStore.getSocket();
      let channel = SessionStore.getChannel();
      let isPresenter = SessionStore.isPresenter();
      let didRequestToken = SessionStore.didRequestToken();
      let accessToken = SessionStore.getAccessToken();

      assert.isTrue(listener.called);
      assert.equal(
        socket.endpoint, `${__PROTOCOL__}${__HOSTNAME__}${__ROOT__}socket`
      );
      assert.isUndefined(socket.params);
      assert.isFalse(socket.connected);
      assert.equal(channel.channel, 'presentation:attendee');
      assert.deepEqual(channel.params, {});
      assert.isFalse(isPresenter);
      assert.isFalse(didRequestToken);
      assert.isUndefined(accessToken);
      assert.isNull(sessionStorage.getItem('accessToken'));
      assert.isNull(sessionStorage.getItem('tokenRequested'));
    });

  });

});
