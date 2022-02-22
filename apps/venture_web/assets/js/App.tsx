import React from "react";
import { useAppSelector } from "./hooks";
import { selectSlide } from "./features/presentation/presentationSlice";
import { selectAccessKey, selectPresenter } from "./features/session/sessionSlice";

import KeyRequester from "./features/session/KeyRequester";
import SlideViewer from "./features/presentation/SlideViewer";

const App = () => {
  const slide = useAppSelector(selectSlide);
  const isPresenter = useAppSelector(selectPresenter);
  const accessKey = useAppSelector(selectAccessKey);

  return (
    <div className="app">
      {
        accessKey ?
          <SlideViewer
            isPresenter={isPresenter}
            slide={slide}
          /> :
          <KeyRequester  />
      }
    </div>
  );
}

export default App;
