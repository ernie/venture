import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

let notificationAudio = undefined;

const configureChatNotification = () => {
  if (window.HTMLAudioElement) {
    notificationAudio = new Audio("/audio/notification.mp3");
  }

  const loadAudio = () => {
    notificationAudio.load();
    window.removeEventListener("click", loadAudio, false);
  }

  window.addEventListener("click", loadAudio, false);
}

configureChatNotification();

export interface Message {
  type?: "system" | "error" | "priv_in" | "priv_out";
  sender: string;
  recipient: string;
  content: string;
}

export interface Nick {
  id: string;
  name?: string;
}

export interface NickChange {
  id: string;
  name?: string;
  prev?: string;
}

export interface ChatState {
  nick?: string;
  editingNick: boolean;
  currentMessage: string;
  messages: Array<Message>;
  nicks: Array<Nick>;
  history: Array<string>;
}

const initialState = {
  nick: sessionStorage.getItem("name"),
  editingNick: true,
  currentMessage: "",
  messages: [],
  nicks: [],
  history: []
}

export const selectNick = (state: RootState) => state.chat.nick;
export const selectEditingNick = (state: RootState) => state.chat.editingNick;
export const selectCurrentMessage = (state: RootState) => state.chat.currentMessage;
export const selectNicks = (state: RootState) => state.chat.nicks;
export const selectMessages = (state: RootState) => state.chat.messages;
export const selectHistory = (state: RootState) => state.chat.history;

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    messageSent: (state, action: PayloadAction<string>) => {
      if (action.payload.trim() != "" &&
          state.history.indexOf(action.payload) === -1) {
        state.history = [action.payload].concat(state.history.slice(0, 19));
      }
      state.currentMessage = "";
    },
    receiveMessage: (state, action: PayloadAction<Message>) => {
      if (action.payload.type === "priv_in" && notificationAudio) {
        notificationAudio.pause();
        notificationAudio.currentTime = 0;
        notificationAudio.play();
      }
      state.messages.push(action.payload);
    },
    receivePresence: (state, action: PayloadAction<Array<Nick>>) => {
      state.nicks = action.payload.sort( (a, b) => {
        if (!a.name && b.name) { return -1; }
        if (a.name && !b.name) { return 1; }
        if (!a.name && !b.name) { return 0; }
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      });
    },
    receiveLeave: (state, action: PayloadAction<Nick>) => {
      const { name } = action.payload;
      if (name) {
        state.messages.push(
          {
            type: "system",
            content: `${name} has left.`
          }
        );
      }
    },
    receiveNickChange: (state, action: PayloadAction<NickChange>) => {
      const { prev, name } = action.payload;
      let content: string;
      if (prev !== name) {
        if (prev) {
          if (name) {
            content = `${prev} is now known as ${name}.`
          } else {
            content = `${prev} slips back into the shadows.`
          }
        } else if (name) {
          content = `${name} emerges from the shadows.`
        }
        state.messages.push({ type: "system", content: content });
      }
    },
    editNick: (state, _action: PayloadAction) => {
      state.editingNick = true;
    },
    receiveNickSet: (state, action: PayloadAction<Nick>) => {
      const { name } = action.payload;
      if (name) {
        sessionStorage.setItem("name", name);
      } else {
        sessionStorage.removeItem("name");
      }
      state.editingNick = false;
      state.nick = name;
    },
    receiveNickError: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearChat: (state, _action: PayloadAction) => {
      state.nicks = [];
      state.messages = [];
    },
    prefillDirectMessage: (state, action: PayloadAction<string>) => {
      state.currentMessage = `/msg "${action.payload}" `;
    }
  }
});

export const {
  messageSent, receiveMessage, receivePresence, receiveLeave, receiveNickChange,
  receiveNickSet, receiveNickError, clearChat, editNick, prefillDirectMessage
} = chatSlice.actions

export const join = createAction("chat/join");
export const leave = createAction("chat/leave");
export const setNick = createAction<string>("chat/setNick");
export const sendMessage = createAction<string>("chat/sendMessage");

export default chatSlice.reducer;

