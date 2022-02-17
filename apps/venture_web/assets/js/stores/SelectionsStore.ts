import AppDispatcher, { Action } from '../dispatcher/AppDispatcher';
import SessionConstants from '../constants/SessionConstants';
import SlideConstants from '../constants/SlideConstants';
import SelectionConstants from '../constants/SelectionConstants';
import { EventEmitter } from 'events';

class SelectionStore extends EventEmitter {
  dispatchToken: string;

  selections = {};

  get() {
    return this.selections;
  }

  emitChange() {
    this.emit(SelectionConstants.SELECTIONS_UPDATED);
  }

  addChangeListener(callback: () => void) {
    this.on(SelectionConstants.SELECTIONS_UPDATED, callback);
  }

  removeChangeListener(callback: () => void) {
    this.removeListener(SelectionConstants.SELECTIONS_UPDATED, callback);
  }
}

let store = new SelectionStore();

store.dispatchToken = AppDispatcher.register((action: Action) => {
  switch(action.actionType) {
    case SessionConstants.CONNECTED:
      store.selections = action.data.selections;
      store.emitChange();
      break;
    case SlideConstants.SLIDE_RECEIVED:
      if (action.data.selections) {
        store.selections = action.data.selections;
        store.emitChange();
      }
      break;
    case SelectionConstants.SELECTIONS_RECEIVED:
      store.selections = action.data;
      store.emitChange();
      break;
    default:
  }
});

export default store;
