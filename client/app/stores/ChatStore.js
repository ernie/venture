import Immutable from 'immutable';
import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';

import ChatActions from '../actions/ChatActions';
import ChatConstants from '../constants/ChatConstants';
import SlideConstants from '../constants/SlideConstants';
import SlideStore from '../stores/SlideStore';
import SessionConstants from '../constants/SessionConstants';
import SessionStore from '../stores/SessionStore';

import Message from '../records/Message';
import Nick from '../records/Nick';

class ChatStore extends EventEmitter {

  constructor(...args) {
    super(...args);
    this.nick = new Nick({name: sessionStorage.getItem('name')});
    this.editing = true;
    this.messages = new Immutable.List();
    this.nicks = new Immutable.Map();
    this.channel = undefined;
  }

  isEditing() {
    return this.editing;
  }

  getChannel() {
    return this.channel;
  }

  getNick() {
    return this.nick;
  }

  getMessages() {
    return this.messages;
  }

  reset() {
    this.nicks = new Immutable.Map();
    this.messages = new Immutable.List();
  }

  getNicks() {
    return this.nicks.toArray().sort( (a, b) => {
      if (!a.name && b.name) { return -1; }
      if (a.name && !b.name) { return 1; }
      if (!a.name && !b.name) { return 0; }
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    });
  }

  joinChannel() {
    if (!this.channel || this.channel.state === 'closed') {
      let socket = SessionStore.getSocket();
      let channel = socket.channel(
        'chat:channel', {name: this.nick.name}
      );
      channel.onError( () => channel.leave() );
      channel.on("message", (message) => {
        ChatActions.receiveMessage(message);
      });
      channel.on("join", (join) => {
        ChatActions.receiveJoin(join);
      });
      channel.on("leave", (leave) => {
        ChatActions.receiveLeave(leave);
      });
      channel.on("nick", (change) => {
        ChatActions.receiveNickChange(change);
      });
      channel.on("nick_set", (change) => {
        ChatActions.receiveNickSet(change);
      });
      channel.on("nick_error", (error) => {
        ChatActions.receiveNickError(error);
      });
      channel.join()
        .receive('ok', (data) => {
          AppDispatcher.dispatch({
            actionType: ChatConstants.CHANNEL_JOINED,
            data: data
          });
        });
      this.channel = channel;
    }
  }

  leaveChannel() {
    if (this.channel) {
      this.channel.leave();
      this.channel = undefined;
    }
  }

  emitChange() {
    this.emit(ChatConstants.CHAT_UPDATED);
  }

  addChangeListener(callback) {
    this.on(ChatConstants.CHAT_UPDATED, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(ChatConstants.CHAT_UPDATED, callback);
  }

}

let store = new ChatStore();

store.dispatchToken = AppDispatcher.register((action) => {
  switch(action.actionType) {
    case SessionConstants.CONNECTED:
    case SlideConstants.SLIDE_RECEIVED:
      AppDispatcher.waitFor([SlideStore.dispatchToken]);
      let slide = SlideStore.get();
      if (slide.type === 'chat') {
        store.joinChannel();
      } else {
        store.reset();
        store.leaveChannel();
      }
      store.emitChange();
    case ChatConstants.EDIT_NICK:
      store.editing = true;
      store.emitChange();
      break;
    case ChatConstants.NICK_SET:
      if (action.data.name) {
        sessionStorage.setItem('name', action.data.name);
        store.editing = false;
      } else {
        sessionStorage.removeItem('name');
        store.editing = true;
      }
      store.nick = new Nick(action.data);
      store.emitChange();
      break;
    case ChatConstants.NICK_ERROR:
      store.editing = true;
      sessionStorage.removeItem('name');
      store.emitChange();
      break;
    case ChatConstants.CHANNEL_JOINED:
      store.nicks = new Immutable.Map(
        action.data.nicks.map( (nick) => [nick.id, new Nick(nick)] )
      );
      store.emitChange();
      break;
    case ChatConstants.CHANNEL_JOIN_ERROR:
      sessionStorage.removeItem('name');
      store.channel = undefined;
      store.emitChange();
      break;
    case ChatConstants.USER_JOINED:
      store.nicks = store.nicks.set(action.data.id, new Nick(action.data));
      store.emitChange();
      break;
    case ChatConstants.USER_CHANGED:
      store.nicks = store.nicks.set(action.data.id, new Nick(action.data));
      var { prev, name } = action.data;
      if (prev !== name) {
        if (prev) {
          if (name) {
            store.messages = store.messages.push(
              new Message(
                {
                  type: 'system',
                  content: `${prev} is now known as ${name}.`
                }
              )
            );
          } else {
            store.messages = store.messages.push(
              new Message(
                {
                  type: 'system',
                  content: `${prev} slips back into the shadows.`
                }
              )
            );
          }
        } else if (name) {
          store.messages = store.messages.push(
            new Message(
              {
                type: 'system',
                content: `${name} emerges from the shadows.`
              }
            )
          );
        }
        store.emitChange();
      }
      break;
    case ChatConstants.USER_LEFT:
      var { name } = action.data;
      if (name) {
        store.messages = store.messages.push(
          new Message(
            {
              type: 'system',
              content: `${name} has left.`
            }
          )
        );
      }
      store.nicks = store.nicks.delete(action.data.id);
      store.emitChange();
      break;
    case ChatConstants.MESSAGE_RECEIVED:
      store.messages = store.messages.push(new Message(action.data));
      store.emitChange();
      break;
    default:
  }
});

export default store;
