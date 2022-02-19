import React from "react";
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

export default class App extends React.Component {

  state = getState();

  componentDidMount() {
    SlideStore.addChangeListener(this.handleChange);
    SessionStore.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    SlideStore.removeChangeListener(this.handleChange);
    SessionStore.removeChangeListener(this.handleChange);
  }

  handleChange = () => {
    this.setState(getState());
  }

  render() {
    return (
      <div className="app">
        {
          this.state.accessKey ?
            <SlideViewer
              channel={this.state.channel}
              isPresenter={this.state.isPresenter}
              slide={this.state.slide}
            /> :
            <KeyRequester  />
        }
      </div>
    );
  }
}
