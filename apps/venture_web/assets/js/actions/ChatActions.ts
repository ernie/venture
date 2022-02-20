import AppDispatcher from "../dispatcher/AppDispatcher";
import ChatConstants from "../constants/ChatConstants";
import { Channel, Presence } from "phoenix";
import NickRecord from "../records/Nick";
import Message from "../records/Message";

let notification = undefined;
if (window.HTMLAudioElement) {
  notification = new Audio("/audio/notification.mp3");
}

let loadAudio = () => {
  if (notification.readyState !== 4) {
    notification.load();
  }
  document.removeEventListener("click", loadAudio, false);
}

window.addEventListener("click", loadAudio, false);

export default {

  nickClicked(nick: string) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.NICK_CLICKED,
      data: nick
    });
  },

  editNick() {
    AppDispatcher.dispatch({
      actionType: ChatConstants.EDIT_NICK
    });
  },

  setNick(channel: Channel, name: string) {
    channel.push("nick", {name: name});
  },

  sendMessage(channel: Channel, content: string) {
    channel.push("message", {content: content});
    AppDispatcher.dispatch({
      actionType: ChatConstants.MESSAGE_SENT,
      data: content
    });
  },

  receiveNickSet(nick: NickRecord) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.NICK_SET,
      data: nick
    });
  },

  receiveNickError(message: Message) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.MESSAGE_RECEIVED,
      data: message
    });
  },

  receiveMessage(message: Message) {
    if (message.type === "priv_in" && notification) {
      notification.pause();
      notification.currentTime = 0;
      notification.play();
    }
    AppDispatcher.dispatch({
      actionType: ChatConstants.MESSAGE_RECEIVED,
      data: message
    });
  },

  receiveJoin(nick: NickRecord) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.USER_JOINED,
      data: nick
    });
  },

  receivePresence(presence: Presence) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.PRESENCE_RECEIVED,
      data: presence
    });
  },

  receiveLeave(nick: NickRecord) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.USER_LEFT,
      data: nick
    });
  },

  receiveNickChange(nick: NickRecord) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.USER_CHANGED,
      data: nick
    });
  }

}
