import { assert } from 'chai';

import ChatActions from '../ChatActions';
import ChatConstants from '../../constants/ChatConstants';

let mockNotification = {

  paused: false,
  played: false,
  currentTime: 100,

  play() {
    this.played = true;
  },

  pause() {
    this.paused = true;
  }

};

let mockDispatcher = {

  lastDispatch: {},

  dispatch(message) {
    this.lastDispatch = message;
  }

};

let mockChannel = {

  lastPush: [],

  push(event, message) {
    this.lastPush = [event, message];
  }

};

describe('ChatActions', () => {

  before( () => {
    ChatActions.__Rewire__('AppDispatcher', mockDispatcher);
    ChatActions.__Rewire__('notification', mockNotification);
  });

  after( () => {
    ChatActions.__ResetDependency__('AppDispatcher');
    ChatActions.__ResetDependency__('notification');
  });

  it('dispatches nick for nickClicked', () => {
    ChatActions.nickClicked('Bob');
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: ChatConstants.NICK_CLICKED,
        data: 'Bob'
      }
    );
  });

  it('dispatches for editNick', () => {
    ChatActions.editNick();
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: ChatConstants.EDIT_NICK
      }
    );
  });

  it('pushes nick change for setNick', () => {
    ChatActions.setNick(mockChannel, 'new nick');
    assert.deepEqual(
      mockChannel.lastPush,
      ['nick', {name: 'new nick'}]
    );
  });

  it('pushes message and dispatches for sendMessage', () => {
    ChatActions.sendMessage(mockChannel, 'a message');
    assert.deepEqual(
      mockChannel.lastPush,
      ['message', {content: 'a message'}]
    );
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: ChatConstants.MESSAGE_SENT,
        data: 'a message'
      }
    );
  });

  it('dispatches for receiveNickSet', () => {
    ChatActions.receiveNickSet('Bob');
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: ChatConstants.NICK_SET,
        data: 'Bob'
      }
    );
  });

  it('dispatches for receiveNickError', () => {
    ChatActions.receiveNickError('whatever is here is dispatched unmodified');
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: ChatConstants.MESSAGE_RECEIVED,
        data: 'whatever is here is dispatched unmodified'
      }
    );
  });

  it('dispatches for receiveMessage', () => {
    ChatActions.receiveMessage({type: 'normal', content: 'hello'});
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: ChatConstants.MESSAGE_RECEIVED,
        data: {type: 'normal', content: 'hello'}
      }
    );
  });

  it('plays notification for incoming private message', () => {
    ChatActions.receiveMessage({type: 'priv_in', content: 'hello'});
    assert.isTrue(mockNotification.paused);
    assert.equal(mockNotification.currentTime, 0);
    assert.isTrue(mockNotification.played);
  });

  it('dispatches for receiveJoin', () => {
    ChatActions.receiveJoin('a join message');
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: ChatConstants.USER_JOINED,
        data: 'a join message'
      }
    );
  });

  it('dispatches for receiveLeave', () => {
    ChatActions.receiveLeave('a leave message');
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: ChatConstants.USER_LEFT,
        data: 'a leave message'
      }
    );
  });

  it('dispatches for receiveNicKChange', () => {
    ChatActions.receiveNickChange('a nick change message');
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: ChatConstants.USER_CHANGED,
        data: 'a nick change message'
      }
    );
  });

});
