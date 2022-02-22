import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface SessionState {
  accessKey?: string;
}

interface ConnectedPayload {
  accessKey: string;
}

export const selectAccessKey = (state: RootState) => state.session.accessKey;
export const selectConnected = (state: RootState) => !!state.session.accessKey;
export const selectPresenter = (state: RootState) => state.session.accessKey && (state.session.accessKey !== ":attendee");

const initialState: SessionState = {
  accessKey: undefined
}

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    connected: (state, action: PayloadAction<ConnectedPayload>) => {
      state.accessKey = action.payload.accessKey;
    },
  }
});

export const { connected } = sessionSlice.actions
export const connect = createAction<string>("session/connect");

export default sessionSlice.reducer;
