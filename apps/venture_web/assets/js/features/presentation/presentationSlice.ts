import { createSlice, createAction, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface SlideState {
  type: "chat" | "fork" | "poll" | "slide" | "title";
  location: {story: string, index: number};
  next?: SlideState;
  background?: string |
              { color?: string, image?: string, darken?: number, lighten?: number };
  class?: string | Array<string>;
  notes?: string;
  attribution?: string |
                { content: string, position?: string };
  align?: string;
  content?: string;
  paths?: Array<SlideState>;
  options?: Array<string>;
}

export interface SelectionsState {
  [index: string]: number;
}
type SelectionsPayload = SelectionsState;

export interface ConnectionsState {
  attendees: number;
  presenters: number;
}
type ConnectionsPayload = ConnectionsState;

export interface PresentationState {
  slide: SlideState;
  selections: SelectionsState;
  connections?: ConnectionsState;
}

interface SlidePayload {
  slide: SlideState;
  selections?: SelectionsState;
}

export const selectSlide = (state: RootState) => state.presentation.slide;
export const selectConnections = (state: RootState) => state.presentation.connections;
export const selectSelections = (state: RootState) => state.presentation.selections;

const initialState: PresentationState = {
  slide: {} as SlideState,
  selections: {} as SelectionsState,
  connections: {} as ConnectionsState
}

export const presentationSlice = createSlice({
  name: "presentation",
  initialState,
  reducers: {
    receiveSlide: (state, action: PayloadAction<SlidePayload>) => {
      state.slide = action.payload.slide;
      if (action.payload.selections) {
        state.selections = action.payload.selections;
      }
    },
    receiveSelections: (state, action: PayloadAction<SelectionsPayload>) => {
      state.selections = action.payload;
    },
    receiveConnections: (state, action: PayloadAction<ConnectionsPayload>) => {
      state.connections = action.payload;
    }
  }
});

export const { receiveSlide, receiveSelections, receiveConnections } = presentationSlice.actions
export const nextSlide = createAction("presentation/nextSlide");
export const prevSlide = createAction("presentation/prevSlide");
export const reset = createAction("presentation/reset");
export const reload = createAction("presentation/reload");
export const optionSelect = createAction<string>("presentation/optionSelect")

export default presentationSlice.reducer;
