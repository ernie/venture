import React, { FC, ReactElement } from "react";
import { Provider } from "react-redux";
import { store, reset, AppDispatch } from "./js/store";
import { render, RenderOptions } from '@testing-library/react'

export interface UseStoreOptions {
  mockDispatch?: boolean
}

let originalDispatch: AppDispatch;

export const useStore = ({ mockDispatch = false }: UseStoreOptions = {}) => {
  beforeEach( () => {
    store.dispatch(reset());
    if (mockDispatch) {
      originalDispatch = store.dispatch;
      store.dispatch = jest.fn();
    }
  });
  if (mockDispatch) {
    afterEach( () => {
      store.dispatch = originalDispatch;
    });
  }
  return store;
}

export const mockDispatch = () => {
  beforeEach( () => {
    originalDispatch = store.dispatch;
    store.dispatch = jest.fn();
  });
  afterEach( () => {
    store.dispatch = originalDispatch;
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
