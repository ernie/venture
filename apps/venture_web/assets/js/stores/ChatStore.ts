import Immutable from "immutable";
import { EventEmitter } from "events";
import { Channel, Presence } from "phoenix";

import AppDispatcher, { Action } from "../dispatcher/AppDispatcher";

import ChatActions from "../actions/ChatActions";
import ChatConstants from "../constants/ChatConstants";
import SlideConstants from "../constants/SlideConstants";
import SlideStore from "../stores/SlideStore";
import SessionConstants from "../constants/SessionConstants";
import SessionStore from "../stores/SessionStore";

import Message from "../records/Message";
import Nick from "../records/Nick";

interface JoinData {
  nicks: Immutable.Map<string, Nick>;
}

class ChatStore extends EventEmitter {
  nick: Nick;
  editing: boolean;
  messages: Immutable.List<Message>;
  nicks: Immutable.Map<string, Nick>;
  channel?: Channel;
  presence?: Presence;
  dispatchToken?: string;

  constructor() {
    super();
    this.nick = new Nick({name: sessionStorage.getItem("name")});
    this.editing = true;
    this.messages = Immutable.List();
    this.nicks = Immutable.Map();
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
    this.nicks = Immutable.Map();
    this.messages = Immutable.List();
  }

  getNicks() {
    return this.nicks.toIndexedSeq().toArray().sort( (a, b) => {
      if (!a.name && b.name) { return -1; }
      if (a.name && !b.name) { return 1; }
      if (!a.name && !b.name) { return 0; }
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    });
  }

  presenceSync(presence: Presence) {
    this.nicks = Immutable.Map(
      presence.list((_id, {metas: [meta, ..._rest]}) => {
        return([meta.id, new Nick({ id: meta.id, name: meta.name })]);
      })
    );
    this.emitChange();
  }

  joinChannel() {
    if (!this.channel || this.channel.state === "closed") {
      let socket = SessionStore.getSocket();
      let channel = socket.channel(
        "chat", {name: this.nick.name}
      );
      let presence = new Presence(channel);
      presence.onSync( () => this.presenceSync(presence));
      channel.onError( () => channel.leave() );
      channel.on("message", (message: Message) => {
        ChatActions.receiveMessage(message);
      });
      channel.on("join", (join: Nick) => {
        ChatActions.receiveJoin(join);
      });
      channel.on("leave", (leave: Nick) => {
        ChatActions.receiveLeave(leave);
      });
      channel.on("nick", (change: Nick) => {
        ChatActions.receiveNickChange(change);
      });
      channel.on("nick_set", (change: Nick) => {
        ChatActions.receiveNickSet(change);
      });
      channel.on("nick_error", (error: Message) => {
        ChatActions.receiveNickError(error);
      });
      channel.join()
        .receive("ok", (data: JoinData) => {
          AppDispatcher.dispatch({
            actionType: ChatConstants.CHANNEL_JOINED,
            data: data
          });
        });
      this.channel = channel;
      this.presence = presence;
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

  addChangeListener(callback: () => void) {
    this.on(ChatConstants.CHAT_UPDATED, callback);
  }

  removeChangeListener(callback: () => void) {
    this.removeListener(ChatConstants.CHAT_UPDATED, callback);
  }

}

let store = new ChatStore();

store.dispatchToken = AppDispatcher.register((action: Action) => {
  switch(action.actionType) {
    case SessionConstants.CONNECTED:
    case SlideConstants.SLIDE_RECEIVED:
      AppDispatcher.waitFor([SlideStore.dispatchToken]);
      let slide = SlideStore.get();
      if (slide.type === "chat") {
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
        sessionStorage.setItem("name", action.data.name);
        store.editing = false;
      } else {
        sessionStorage.removeItem("name");
        store.editing = true;
      }
      store.nick = new Nick(action.data);
      store.emitChange();
      break;
    case ChatConstants.NICK_ERROR:
      store.editing = true;
      sessionStorage.removeItem("name");
      store.emitChange();
      break;
    case ChatConstants.USER_JOINED:
      store.emitChange();
      break;
    case ChatConstants.USER_CHANGED:
      var { prev, name } = action.data;
      if (prev !== name) {
        if (prev) {
          if (name) {
            store.messages = store.messages.push(
              new Message(
                {
                  type: "system",
                  content: `${prev} is now known as ${name}.`
                }
              )
            );
          } else {
            store.messages = store.messages.push(
              new Message(
                {
                  type: "system",
                  content: `${prev} slips back into the shadows.`
                }
              )
            );
          }
        } else if (name) {
          store.messages = store.messages.push(
            new Message(
              {
                type: "system",
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
              type: "system",
              content: `${name} has left.`
            }
          )
        );
      }
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
