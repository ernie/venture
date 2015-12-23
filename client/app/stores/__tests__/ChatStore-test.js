import { assert } from 'chai';
import Immutable from 'immutable';
import Nick from '../../records/Nick';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import ChatStore from '../ChatStore';

import SessionConstants from '../../constants/SessionConstants';
import SlideConstants from '../../constants/SlideConstants';
import ChatConstants from '../../constants/ChatConstants';

let fakeSlide = {
  type: 'slide',
  content: 'hello',
  notes: ''
};

let fakeChatSlide = {
  type: 'chat',
  content: '',
  notes: ''
};

let ernie = { id: 'ernie', name: 'Ernie' };
let bert = { id: 'bert', name: 'Bert' };
let fakeNicks = [ernie, bert];
let fakeNicksImmutable = new Immutable.Map(
  fakeNicks.map( (nick) => [nick.id, new Nick(nick)] )
);

let mockSlideStore = {

  slide: {},

  get() {
    return this.slide;
  }

};

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

let mockSocket = {
  channel(channel, params) {
    return new MockChannel(channel, params);
  }
};

let mockSessionStore = {
  getSocket() { return mockSocket; }
};

let callback = AppDispatcher._callbacks[ChatStore.dispatchToken];

describe('ChatStore', () => {

  beforeEach( () => {
    AppDispatcher._isDispatching = true;
    ChatStore.__Rewire__('SlideStore', mockSlideStore);
    ChatStore.__Rewire__('SessionStore', mockSessionStore);
    sinon.stub(AppDispatcher, 'waitFor');
    ChatStore.channel = undefined;
  });

  afterEach( () => {
    AppDispatcher._isDispatching = false;
    ChatStore.__ResetDependency__('SlideStore');
    ChatStore.__ResetDependency__('SessionStore');
    AppDispatcher.waitFor.restore();
  });

  it('resets and leaves channel when connecting and non-chat slide', () => {
    mockSlideStore.slide = fakeSlide;
    let mockChannel = new MockChannel('chat:channel', {name: null});
    ChatStore.channel = mockChannel;
    callback({
      actionType: SessionConstants.CONNECTED,
      data: {
        slide: fakeSlide
      }
    });
    assert.isTrue(mockChannel.left);
    assert.isUndefined(ChatStore.channel);
  });

  it('joins channel when connecting and chat slide', () => {
    mockSlideStore.slide = fakeChatSlide;
    callback({
      actionType: SessionConstants.CONNECTED,
      data: {
        slide: fakeChatSlide
      }
    });
    assert.isTrue(ChatStore.channel.joined);
    assert.equal(ChatStore.channel.channel, 'chat:channel');
    assert.deepEqual(ChatStore.channel.params, {name: ChatStore.nick.name});
  });

  it('resets and leaves channel when non-chat slide received', () => {
    mockSlideStore.slide = fakeSlide;
    let mockChannel = new MockChannel('chat:channel', {name: null});
    ChatStore.channel = mockChannel;
    callback({
      actionType: SlideConstants.SLIDE_RECEIVED,
      data: {
        slide: fakeSlide
      }
    });
    assert.isTrue(mockChannel.left);
    assert.isUndefined(ChatStore.channel);
  });

  it('joins channel when chat slide received', () => {
    mockSlideStore.slide = fakeChatSlide;
    callback({
      actionType: SlideConstants.SLIDE_RECEIVED,
      data: {
        slide: fakeChatSlide
      }
    });
    assert.isTrue(ChatStore.channel.joined);
    assert.equal(ChatStore.channel.channel, 'chat:channel');
    assert.deepEqual(ChatStore.channel.params, {name: ChatStore.nick.name});
  });

  it('sets editing to true and emits change when EDIT_NICK received', () => {
    ChatStore.editing = false;
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.EDIT_NICK
    });
    ChatStore.removeChangeListener(listener);
    assert.isTrue(ChatStore.isEditing());
    assert.isTrue(listener.called);
  });

  it('sets a nick', () => {
    ChatStore.editing = true;
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.NICK_SET,
      data: { id: 'ernie', name: 'Ernie' }
    });
    ChatStore.removeChangeListener(listener);
    assert.isFalse(ChatStore.isEditing());
    assert.equal(sessionStorage.getItem('name'), 'Ernie');
    assert.equal(ChatStore.nick.name, 'Ernie');
    assert.equal(ChatStore.nick.id, 'ernie');
    assert.isTrue(listener.called);
  });

  it('removes a nick', () => {
    ChatStore.editing = false;
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.NICK_SET,
      data: { id: 'ernie', name: null }
    });
    ChatStore.removeChangeListener(listener);
    assert.isTrue(ChatStore.isEditing());
    assert.equal(sessionStorage.getItem('name'), undefined);
    assert.equal(ChatStore.nick.name, null);
    assert.equal(ChatStore.nick.id, 'ernie');
    assert.isTrue(listener.called);
  });

  it('handles a nick setting error by removing nick', () => {
    ChatStore.editing = false;
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    sessionStorage.setItem('name', 'Ernie');
    callback({
      actionType: ChatConstants.NICK_ERROR
    });
    ChatStore.removeChangeListener(listener);
    assert.isTrue(ChatStore.isEditing());
    assert.equal(sessionStorage.getItem('name'), undefined);
    assert.isTrue(listener.called);
  });

  it('sets nick list on channel join', () => {
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.CHANNEL_JOINED,
      data: {nicks: fakeNicks}
    });
    ChatStore.removeChangeListener(listener);
    assert.equal(ChatStore.nicks.size, 2);
    assert.equal(ChatStore.nicks.get('bert').name, 'Bert');
    assert.equal(ChatStore.nicks.get('ernie').name, 'Ernie');
    assert.isTrue(listener.called);
  });

  it('removes name and channel if channel join fails', () => {
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    ChatStore.channel = new MockChannel('chat:channel', {name: 'Ernie'});
    sessionStorage.setItem('name', 'Ernie');
    callback({
      actionType: ChatConstants.CHANNEL_JOIN_ERROR
    });
    ChatStore.removeChangeListener(listener);
    assert.isTrue(ChatStore.isEditing());
    assert.equal(sessionStorage.getItem('name'), undefined);
    assert.isTrue(listener.called);
  });

  it('adds new user to nick list on user join', () => {
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.USER_JOINED,
      data: { id: 'grover', name: 'Grover' }
    });
    ChatStore.removeChangeListener(listener);
    assert.equal(ChatStore.nicks.get('grover').name, 'Grover');
    assert.isTrue(listener.called);
  });

  it('updates nick list and adds a message if user sets first nick', () => {
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    ChatStore.nicks = fakeNicksImmutable;
    callback({
      actionType: ChatConstants.USER_CHANGED,
      data: { id: 'ernie', prev: null, name: 'Ernie' }
    });
    ChatStore.removeChangeListener(listener);
    assert.equal(ChatStore.nicks.get('ernie').name, 'Ernie');
    assert.isTrue(listener.called);
    let message = ChatStore.messages.last();
    assert.equal(message.type, 'system');
    assert.equal(message.content, 'Ernie emerges from the shadows.');
  });

  it('updates nick list and adds a message if user changes nick', () => {
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    ChatStore.nicks = fakeNicksImmutable;
    callback({
      actionType: ChatConstants.USER_CHANGED,
      data: { id: 'ernie', prev: 'Ernie', name: 'Ernest' }
    });
    ChatStore.removeChangeListener(listener);
    assert.equal(ChatStore.nicks.get('ernie').name, 'Ernest');
    assert.isTrue(listener.called);
    let message = ChatStore.messages.last();
    assert.equal(message.type, 'system');
    assert.equal(message.content, 'Ernie is now known as Ernest.');
  });

  it('updates nick list and adds a message if user lurks', () => {
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    ChatStore.nicks = fakeNicksImmutable;
    callback({
      actionType: ChatConstants.USER_CHANGED,
      data: { id: 'ernie', prev: 'Ernie', name: null }
    });
    ChatStore.removeChangeListener(listener);
    assert.isNull(ChatStore.nicks.get('ernie').name);
    assert.isTrue(listener.called);
    let message = ChatStore.messages.last();
    assert.equal(message.type, 'system');
    assert.equal(message.content, 'Ernie slips back into the shadows.');
  });

  it('updates nick list and adds a message if user leaves', () => {
    let listener = sinon.spy();
    ChatStore.nicks = fakeNicksImmutable;
    ChatStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.USER_LEFT,
      data: { id: 'ernie', name: 'Ernie' }
    });
    ChatStore.removeChangeListener(listener);
    assert.isUndefined(ChatStore.nicks.get('ernie'));
    assert.isTrue(listener.called);
    let message = ChatStore.messages.last();
    assert.equal(message.type, 'system');
    assert.equal(message.content, 'Ernie has left.');
  });

  it('appends newly-received messages', () => {
    let listener = sinon.spy();
    ChatStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.MESSAGE_RECEIVED,
      data: { type: 'normal', sender: 'Ernie', content: 'hello!' }
    });
    ChatStore.removeChangeListener(listener);
    assert.isTrue(listener.called);
    let message = ChatStore.messages.last();
    assert.equal(message.type, 'normal');
    assert.equal(message.sender, 'Ernie');
    assert.equal(message.content, 'hello!');
  });

});
