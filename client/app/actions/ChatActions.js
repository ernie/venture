import AppDispatcher from '../dispatcher/AppDispatcher';
import ChatConstants from '../constants/ChatConstants';
import SessionStore from '../stores/SessionStore';

let notification = undefined;
if (window.HTMLAudioElement) {
  notification = new Audio(`${__ROOT__}audio/notification.mp3`);
}

let loadAudio = () => {
  if (notification.readyState !== 4) {
    notification.load();
  }
  document.removeEventListener('click', loadAudio, false);
}

window.addEventListener('click', loadAudio, false);

export default {

  nickClicked(nick) {
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

  setNick(channel, name) {
    channel.push('nick', {name: name});
  },

  sendMessage(channel, content) {
    channel.push('message', {content: content});
    AppDispatcher.dispatch({
      actionType: ChatConstants.MESSAGE_SENT,
      data: content
    });
  },

  receiveNickSet(nick) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.NICK_SET,
      data: nick
    });
  },

  receiveNickError(message) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.MESSAGE_RECEIVED,
      data: message
    });
  },

  receiveMessage(message) {
    if (message.type === 'priv_in' && notification) {
      notification.pause();
      notification.currentTime = 0;
      notification.play();
    }
    AppDispatcher.dispatch({
      actionType: ChatConstants.MESSAGE_RECEIVED,
      data: message
    });
  },

  receiveJoin(join) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.USER_JOINED,
      data: join
    });
  },

  receiveLeave(leave) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.USER_LEFT,
      data: leave
    });
  },

  receiveNickChange(change) {
    AppDispatcher.dispatch({
      actionType: ChatConstants.USER_CHANGED,
      data: change
    });
  }

}
