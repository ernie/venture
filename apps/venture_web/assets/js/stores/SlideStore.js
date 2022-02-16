import AppDispatcher from '../dispatcher/AppDispatcher';
import SessionConstants from '../constants/SessionConstants';
import SlideConstants from '../constants/SlideConstants';
import { EventEmitter } from 'events';

import Slide from '../records/Slide';
import TitleSlide from '../records/TitleSlide';
import ForkSlide from '../records/ForkSlide';
import PollSlide from '../records/PollSlide';
import ChatSlide from '../records/ChatSlide';
import EmptySlide from '../records/EmptySlide';

function newSlide(data) {
  switch(data.type) {
    case 'slide':
      return new Slide(data);
    case 'title':
      return new TitleSlide(data);
    case 'fork':
      data.paths = data.paths.map(newSlide);
      return new ForkSlide(data);
    case 'poll':
      return new PollSlide(data);
    case 'chat':
      return new ChatSlide(data);
    default:
      return new EmptySlide(data);
  }
}

class SlideStore extends EventEmitter {

  get() {
    return this.slide || new EmptySlide();
  }

  emitChange() {
    this.emit(SlideConstants.SLIDE_UPDATED);
  }

  addChangeListener(callback) {
    this.on(SlideConstants.SLIDE_UPDATED, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(SlideConstants.SLIDE_UPDATED, callback);
  }
}

let store = new SlideStore();

store.dispatchToken = AppDispatcher.register((action) => {
  switch(action.actionType) {
    case SessionConstants.CONNECTED:
      store.slide = newSlide(action.data.slide);
      store.emitChange();
      break;
    case SlideConstants.SLIDE_RECEIVED:
      store.slide = newSlide(action.data.slide);
      store.emitChange();
      break;
    default:
  }
});

export default store;
