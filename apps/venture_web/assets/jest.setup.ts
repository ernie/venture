import "@testing-library/jest-dom";
import { useStore, wrappedRender, UseStoreOptions } from "jest.helpers";
import { store } from "js/store";

declare global {
  function useStore(options?: UseStoreOptions): typeof store;
  function render(...params: Parameters<typeof wrappedRender>): ReturnType<typeof wrappedRender>;
}

global.useStore = useStore;
global.render = wrappedRender;
