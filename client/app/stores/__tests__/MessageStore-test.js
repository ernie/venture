import { assert } from 'chai';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import MessageStore from '../MessageStore';

import ChatConstants from '../../constants/ChatConstants';
import SlideConstants from '../../constants/SlideConstants';

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

let mockSlideStore = {

  slide: {},

  get() {
    return this.slide;
  }

};

let callback = AppDispatcher._callbacks[MessageStore.dispatchToken];

describe('MessageStore', () => {

  beforeEach( () => {
    MessageStore.message = '';
    MessageStore.history = [];
    MessageStore.__Rewire__('SlideStore', mockSlideStore);
    AppDispatcher._isDispatching = true;
    sinon.stub(AppDispatcher, 'waitFor');
  });

  afterEach( () => {
    MessageStore.__ResetDependency__('SlideStore');
    AppDispatcher._isDispatching = false;
    AppDispatcher.waitFor.restore();
  });

  it('sets message to a /msg when nick clicked', () => {
    let listener = sinon.spy();
    MessageStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.NICK_CLICKED,
      data: 'Ernie'
    });
    MessageStore.removeChangeListener(listener);
    assert.equal(MessageStore.getMessage(), '/msg "Ernie" ');
    assert.isTrue(listener.called);
  });

  it('adds messages to history and resets message when sent', () => {
    let listener = sinon.spy();
    MessageStore.message = 'this will be reset';
    MessageStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.MESSAGE_SENT,
      data: 'Hello, world!'
    });
    MessageStore.removeChangeListener(listener);
    assert.equal(MessageStore.getMessage(), '');
    assert.deepEqual(MessageStore.getHistory(), ['Hello, world!']);
    assert.isTrue(listener.called);
  });

  it('does not add an empty message to history', () => {
    let listener = sinon.spy();
    MessageStore.message = 'this will be reset';
    MessageStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.MESSAGE_SENT,
      data: '   '
    });
    MessageStore.removeChangeListener(listener);
    assert.equal(MessageStore.getMessage(), '');
    assert.deepEqual(MessageStore.getHistory(), []);
    assert.isTrue(listener.called);
  });

  it('does not add a duplicate message to history', () => {
    let listener = sinon.spy();
    MessageStore.message = 'this will be reset';
    MessageStore.addChangeListener(listener);
    callback({
      actionType: ChatConstants.MESSAGE_SENT,
      data: 'hello'
    });
    callback({
      actionType: ChatConstants.MESSAGE_SENT,
      data: 'hello'
    });
    MessageStore.removeChangeListener(listener);
    assert.equal(MessageStore.getMessage(), '');
    assert.deepEqual(MessageStore.getHistory(), ['hello']);
    assert.isTrue(listener.called);
  });

  it('leaves the message when a chat slide is entered', () => {
    let listener = sinon.spy();
    mockSlideStore.slide = fakeChatSlide;
    MessageStore.message = 'this will not be reset';
    MessageStore.addChangeListener(listener);
    callback({
      actionType: SlideConstants.SLIDE_RECEIVED,
      data: {slide: fakeChatSlide}
    });
    MessageStore.removeChangeListener(listener);
    assert.equal(MessageStore.getMessage(), 'this will not be reset');
    assert.isTrue(listener.called);
  });

  it('clears the message when a non-chat slide is entered', () => {
    let listener = sinon.spy();
    mockSlideStore.slide = fakeSlide;
    MessageStore.message = 'this will be reset';
    MessageStore.addChangeListener(listener);
    callback({
      actionType: SlideConstants.SLIDE_RECEIVED,
      data: {slide: fakeSlide}
    });
    MessageStore.removeChangeListener(listener);
    assert.equal(MessageStore.getMessage(), '');
    assert.isTrue(listener.called);
  });

});
