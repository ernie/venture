import { configureStore, combineReducers, createAction, ThunkAction, Action, AnyAction } from "@reduxjs/toolkit";
import { phoenixMiddleware } from "./middlewares/phoenix";
import sessionReducer from "./features/session/sessionSlice";
import presentationReducer from "./features/presentation/presentationSlice";
import chatReducer from "./features/chat/chatSlice";

export const reset = createAction("venture/reset");

const reducers = combineReducers({
  session: sessionReducer,
  presentation: presentationReducer,
  chat: chatReducer
});

const rootReducer = (state: any, action: AnyAction) => {
  if (action.type === `${reset}`) {
    state = undefined;
  }

  return reducers(state, action);
}

export const store = configureStore({
  reducer: rootReducer,
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
