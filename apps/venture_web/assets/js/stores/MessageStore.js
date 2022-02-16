import Immutable from "immutable";
import { EventEmitter } from "events";
import AppDispatcher from "../dispatcher/AppDispatcher";

import ChatActions from "../actions/ChatActions";
import ChatConstants from "../constants/ChatConstants";
import MessageConstants from "../constants/MessageConstants";
import SlideStore from "../stores/SlideStore";
import SlideConstants from "../constants/SlideConstants";
import SessionConstants from "../constants/SessionConstants";

class MessageStore extends EventEmitter {

  message = "";
  history = [];

  getHistory() {
    return this.history;
  }

  getMessage() {
    return this.message;
  }

  emitChange() {
    this.emit(MessageConstants.MESSAGES_UPDATED);
  }

  addChangeListener(callback) {
    this.on(MessageConstants.MESSAGES_UPDATED, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(MessageConstants.MESSAGES_UPDATED, callback);
  }

}

let store = new MessageStore();

store.dispatchToken = AppDispatcher.register((action) => {
  switch(action.actionType) {
    case ChatConstants.NICK_CLICKED:
      store.message = `/msg "${action.data}" `
      store.emitChange();
      break;
    case ChatConstants.MESSAGE_SENT:
      if (action.data.trim() != "" &&
          store.history.indexOf(action.data) === -1) {
        store.history = [action.data].concat(store.history.slice(0, 19));
      }
      store.message = "";
      store.emitChange();
    case SessionConstants.CONNECTED:
    case SlideConstants.SLIDE_RECEIVED:
      AppDispatcher.waitFor([SlideStore.dispatchToken]);
      let slide = SlideStore.get();
      if (slide.type !== "chat") {
        store.message = "";
      }
      store.emitChange();
    default:
  }
});

export default store;
