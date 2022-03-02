import "@testing-library/jest-dom";
import { useStore, wrappedRender } from "jest.helpers";
import { store } from "js/store";

declare global {
  function useStore(): typeof store;
  function render(...params: Parameters<typeof wrappedRender>): ReturnType<typeof wrappedRender>;
}

global.useStore = useStore;
global.render = wrappedRender;
