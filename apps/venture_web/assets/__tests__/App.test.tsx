import React from "react";
import App from "js/App";
import { Provider } from "react-redux";
import { SlideState, receiveSlide } from "js/features/presentation/presentationSlice";
import { connected } from "js/features/session/sessionSlice";

let slide: SlideState;
const store = useStore();

beforeEach( () => {
  slide = {location: { story: "main", index: 0 }, type: "slide" };
  store.dispatch(receiveSlide({slide: slide}));
});

test("without a valid access key requests a key", () => {
  render(
        <App />
  );
  const keyRequester = document.querySelector("#keyRequester");
  const slideContainer = document.querySelector(".slide-container");
  expect(keyRequester).toBeInTheDocument();
  expect(slideContainer).not.toBeInTheDocument();
});

test("with an attendee access key displays the presentation only", () => {
  store.dispatch(connected({accessKey: ":attendee"}));
  render(
        <App />
  );
  const keyRequester = document.querySelector("#keyRequester");
  const slideContainer = document.querySelector(".slide-container");
  const presenterOverlay = document.querySelector("#presenterOverlay");
  expect(keyRequester).not.toBeInTheDocument();
  expect(presenterOverlay).not.toBeInTheDocument();
  expect(slideContainer).toBeInTheDocument();
  expect(slideContainer.id).toEqual("slide-main-0");
});

test("with a presenter access key displays the presenter overlay", () => {
  store.dispatch(connected({accessKey: "presenter"}));
  render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
  const keyRequester = document.querySelector("#keyRequester");
  const slideContainer = document.querySelector(".slide-container");
  const presenterOverlay = document.querySelector("#presenterOverlay");
  expect(keyRequester).not.toBeInTheDocument();
  expect(presenterOverlay).toBeInTheDocument();
  expect(slideContainer).toBeInTheDocument();
  expect(slideContainer.id).toEqual("slide-main-0");
});
