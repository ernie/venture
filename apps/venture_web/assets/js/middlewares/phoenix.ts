import { Socket, Channel, Presence } from "phoenix";
import { Middleware } from "@reduxjs/toolkit";
import { connected, selectConnected } from "../features/session/sessionSlice";

import { connect } from "../features/session/sessionSlice";
import {
  receiveSlide, receiveSelections, receiveConnections, nextSlide, prevSlide,
  reset, reload, optionSelect
} from "../features/presentation/presentationSlice";
import {
  Message, Nick, messageSent, selectNick, receivePresence, receiveMessage,
  receiveJoin, receiveLeave, receiveNickChange, receiveNickSet, receiveNickError,
  clearChat, join, leave, setNick, sendMessage
} from "../features/chat/chatSlice";

export let socket: Socket;
export let presentationChannel: Channel;
export let chatChannel: Channel;
export let chatPresence: Presence;

export const phoenixMiddleware: Middleware = store => next => action => {
    switch (action.type) {
      case `${connect}`:
        const accessKey = action.payload;
        if (!accessKey) { return }
        socket = new Socket("/socket", { params: { key: accessKey } })
        presentationChannel = socket.channel('presentation', {});
        socket.onOpen((_data: () => void) => {
          sessionStorage.setItem("accessKey", accessKey);
          store.dispatch(connected({ accessKey: accessKey }));
        });
        socket.onError((_error: () => void) => {
          if (!selectConnected(store.getState())) {
            socket.disconnect();
            sessionStorage.removeItem("accessKey");
          }
        });
        presentationChannel.on("slide", (slide) => {
          store.dispatch(receiveSlide(slide));
        });
        presentationChannel.on("selections", (selections) => {
          store.dispatch(receiveSelections(selections));
        });
        presentationChannel.on("connections", (connections) => {
          store.dispatch(receiveConnections(connections));
        });
        socket.connect();
        presentationChannel.join()
          .receive('ok', (data) => {
            if (data.connections) {
              store.dispatch(receiveConnections(data.connections));
            }
            store.dispatch(receiveSlide(data));
          });
        break;
      case `${nextSlide}`:
          presentationChannel.push("next", {});
        break;
      case `${prevSlide}`:
          presentationChannel.push("prev", {});
        break;
      case `${reset}`:
          presentationChannel.push("reset", {});
        break;
      case `${reload}`:
        presentationChannel.push("reload", {});
        break;
      case `${optionSelect}`:
        presentationChannel.push("select", { option: action.payload });
        break;
      case `${join}`:
        chatChannel = socket.channel(
          "chat", { name: selectNick(store.getState()) }
        );
        chatPresence = new Presence(chatChannel);
        chatPresence.onSync( () => {
          const newNicks: Array<Nick> = [];
          chatPresence.list((_id: string, {metas: [meta, ..._rest]}) => {
            newNicks.push({ id: meta.id, name: meta.name });
          })
          store.dispatch(receivePresence(newNicks));
        });
        chatChannel.onError( () => chatChannel.leave() );
        chatChannel.on("message", (message: Message) => {
          store.dispatch(receiveMessage(message));
        });
        chatChannel.on("join", (join: Nick) => {
          store.dispatch(receiveJoin(join));
        });
        chatChannel.on("leave", (leave: Nick) => {
          store.dispatch(receiveLeave(leave));
        });
        chatChannel.on("nick", (change: Nick) => {
          store.dispatch(receiveNickChange(change));
        });
        chatChannel.on("nick_set", (change: Nick) => {
          store.dispatch(receiveNickSet(change));
        });
        chatChannel.on("nick_error", (error: Message) => {
          store.dispatch(receiveNickError(error));
        });
        chatChannel.join()
        break;
      case `${leave}`:
        chatChannel.leave();
        store.dispatch(clearChat());
        break;
      case `${setNick}`:
        chatChannel.push("nick", {name: action.payload});
        break;
      case `${sendMessage}`:
        chatChannel.push("message", {content: action.payload});
        store.dispatch(messageSent(action.payload));
        break;
      default:
        next(action);
    }
}
