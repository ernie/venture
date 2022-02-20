import React, { useState, useLayoutEffect } from "react";
import SessionStore from "../../stores/SessionStore";
import SlideStore from "../../stores/SlideStore";
import KeyRequester from "../KeyRequester/KeyRequester";
import SlideViewer from "../SlideViewer/SlideViewer";

function getState() {
  return {
    slide: SlideStore.get(),
    channel: SessionStore.channel,
    isPresenter: SessionStore.isPresenter(),
    accessKey: SessionStore.accessKey
  };
}

const App = () => {

  const [state, setState] = useState(getState);

  const handleChange = () => {
    setState(getState);
  }

  useLayoutEffect(() => {
    SlideStore.addChangeListener(handleChange);
    SessionStore.addChangeListener(handleChange);
    return () => {
      SlideStore.removeChangeListener(handleChange);
      SessionStore.removeChangeListener(handleChange);
    };
  }, []);

  return (
    <div className="app">
      {
        state.accessKey ?
          <SlideViewer
            channel={state.channel}
            isPresenter={state.isPresenter}
            slide={state.slide}
          /> :
          <KeyRequester  />
      }
    </div>
  );
}

export default App;
