import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { phoenixMiddleware } from "./middlewares/phoenix";
import sessionReducer, { connect } from "./features/session/sessionSlice";
import presentationReducer from "./features/presentation/presentationSlice";
import chatReducer from "./features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    presentation: presentationReducer,
    chat: chatReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(phoenixMiddleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// If we have previously connected, we'll have a key here.
store.dispatch(connect(sessionStorage.getItem("accessKey")));
