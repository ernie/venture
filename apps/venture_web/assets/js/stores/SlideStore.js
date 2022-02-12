import AppDispatcher from '../dispatcher/AppDispatcher';
import SessionConstants from '../constants/SessionConstants';
import SlideConstants from '../constants/SlideConstants';
import { EventEmitter } from 'events';

import Slide from '../records/Slide';
import TitleSlide from '../records/TitleSlide';
import Fork from '../records/Fork';
import Poll from '../records/Poll';
import Chat from '../records/Chat';
import EmptySlide from '../records/EmptySlide';

function newSlide(data) {
  switch(data.type) {
    case 'slide':
      return new Slide(data);
      break;
    case 'title':
      return new TitleSlide(data);
      break;
    case 'fork':
      data.paths = data.paths.map(newSlide);
      return new Fork(data);
      break;
    case 'poll':
      return new Poll(data);
      break;
    case 'chat':
      return new Chat(data);
      break;
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
