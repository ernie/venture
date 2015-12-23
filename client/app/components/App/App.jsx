import styles from './_App.scss';

import React from 'react';
import SessionStore from '../../stores/SessionStore';
import SlideStore from '../../stores/SlideStore';
import TokenRequester from '../TokenRequester/TokenRequester';
import SlideViewer from '../SlideViewer/SlideViewer';

function getState() {
  return {
    slide: SlideStore.get(),
    channel: SessionStore.getChannel(),
    isPresenter: SessionStore.isPresenter(),
    didRequestToken: SessionStore.didRequestToken()
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
      <div className={styles.app}>
        {
          this.state.didRequestToken ?
            <SlideViewer
              channel={this.state.channel}
              isPresenter={this.state.isPresenter}
              slide={this.state.slide}
            /> :
            <TokenRequester didRequestToken={this.state.didRequestToken} />
        }
      </div>
    );
  }
}
