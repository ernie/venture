import React, { FC, ReactElement } from "react";
import { Provider } from "react-redux";
import { store, reset } from "./js/store";
import { render, RenderOptions } from '@testing-library/react'

export const useStore = () => {
  beforeEach( () => {
    store.dispatch(reset());
  });
  return store;
}

const wrapper: FC = ({children}) => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        {children}
      </Provider>
    </React.StrictMode>
  );
}

export const wrappedRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: wrapper, ...options });
