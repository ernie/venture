import { assert } from 'chai';

import SlideActions from '../SlideActions';
import SlideConstants from '../../constants/SlideConstants';

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

describe('SlideActions', () => {

  before( () => {
    SlideActions.__Rewire__('AppDispatcher', mockDispatcher);
  });

  after( () => {
    SlideActions.__ResetDependency__('AppDispatcher');
  });

  it('dispatches for receiveSlide', () => {
    SlideActions.receiveSlide({slide: 'totally a slide'});
    assert.deepEqual(
      mockDispatcher.lastDispatch,
      {
        actionType: SlideConstants.SLIDE_RECEIVED,
        data: {slide: 'totally a slide'}
      }
    );
  });

  it('pushes next event for nextSlide', () => {
    SlideActions.nextSlide(mockChannel);
    assert.deepEqual(
      mockChannel.lastPush,
      ['next', undefined]
    );
  });

  it('pushes prev event for prevSlide', () => {
    SlideActions.prevSlide(mockChannel);
    assert.deepEqual(
      mockChannel.lastPush,
      ['prev', undefined]
    );
  });

  it('pushes reset event for resetPresentation', () => {
    SlideActions.resetPresentation(mockChannel);
    assert.deepEqual(
      mockChannel.lastPush,
      ['reset', undefined]
    );
  });

  it('pushes reset event for reloadDeck', () => {
    SlideActions.reloadDeck(mockChannel);
    assert.deepEqual(
      mockChannel.lastPush,
      ['reload', undefined]
    );
  });

  it('pushes select event for selectOption', () => {
    SlideActions.selectOption(mockChannel, 'an-option');
    assert.deepEqual(
      mockChannel.lastPush,
      ['select', {option: 'an-option'}]
    );
  });

});
