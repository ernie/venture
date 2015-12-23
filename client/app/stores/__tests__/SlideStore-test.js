import { assert } from 'chai';

import AppDispatcher from '../../dispatcher/AppDispatcher';
import SlideStore from '../SlideStore';

import SessionConstants from '../../constants/SessionConstants';
import SlideConstants from '../../constants/SlideConstants';

import Chat from '../../records/Chat';

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

let callback = AppDispatcher._callbacks[SlideStore.dispatchToken];

describe('SlideStore', () => {

  beforeEach( () => {
    SlideStore.slide = undefined;
    AppDispatcher._isDispatching = true;
    sinon.stub(AppDispatcher, 'waitFor');
  });

  afterEach( () => {
    AppDispatcher._isDispatching = false;
    AppDispatcher.waitFor.restore();
  });

  it('sets slide on connection', () => {
    let listener = sinon.spy();
    SlideStore.addChangeListener(listener);
    callback({
      actionType: SessionConstants.CONNECTED,
      data: {
        slide: fakeSlide
      }
    });
    SlideStore.removeChangeListener(listener);
    let slide = SlideStore.get();
    assert.equal(slide.type, 'slide');
    assert.equal(slide.content, 'hello');
    assert.isTrue(listener.called);
  });

  it('sets slide on slide received', () => {
    let listener = sinon.spy();
    SlideStore.addChangeListener(listener);
    callback({
      actionType: SlideConstants.SLIDE_RECEIVED,
      data: {
        slide: fakeSlide
      }
    });
    SlideStore.removeChangeListener(listener);
    let slide = SlideStore.get();
    assert.equal(slide.type, 'slide');
    assert.equal(slide.content, 'hello');
    assert.isTrue(listener.called);
  });

  it('changes slide record based on slide type', () => {
    callback({
      actionType: SlideConstants.SLIDE_RECEIVED,
      data: {
        slide: fakeChatSlide
      }
    });
    assert.instanceOf(SlideStore.get(), Chat);
  });

});
