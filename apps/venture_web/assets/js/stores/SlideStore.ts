import AppDispatcher, { Action } from '../dispatcher/AppDispatcher';
import SessionConstants from '../constants/SessionConstants';
import SlideConstants from '../constants/SlideConstants';
import { EventEmitter } from 'events';

import {
  EmptySlide,
  ChatSlide,
  PollSlide,
  ForkSlide,
  TitleSlide,
  Slide,
  SlideLike
} from "../records/Slides";

function newSlide(data: SlideLike) {
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
  slide?: Slide;
  dispatchToken?: string;

  get(): Slide {
    return this.slide || new EmptySlide();
  }

  emitChange() {
    this.emit(SlideConstants.SLIDE_UPDATED);
  }

  addChangeListener(callback: () => void) {
    this.on(SlideConstants.SLIDE_UPDATED, callback);
  }

  removeChangeListener(callback: () => void) {
    this.removeListener(SlideConstants.SLIDE_UPDATED, callback);
  }
}

let store = new SlideStore();

store.dispatchToken = AppDispatcher.register((action: Action) => {
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
