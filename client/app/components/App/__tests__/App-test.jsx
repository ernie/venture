import React from 'react';
import ReactDOM from 'react-dom';
import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import App from '../App';
import TokenRequester from '../../TokenRequester/TokenRequester';
import SlideViewer from '../../SlideViewer/SlideViewer';

let fakeSlide   = { fake: 'slide' };
let fakeChannel = { fake: 'channel' };

let mockSlideStore = {

  get() {
    return fakeSlide;
  }

}

let mockSessionStore = {

  channel: fakeChannel,
  presenter: false,
  requestedToken: false,

  getChannel() {
    return this.channel;
  },

  isPresenter() {
    return this.presenter;
  },

  didRequestToken() {
    return this.requestedToken;
  }

}

describe('App', () => {

  before( () => {
    App.__Rewire__('SlideStore', mockSlideStore);
    App.__Rewire__('SessionStore', mockSessionStore);
  });

  after( () => {
    App.__ResetDependency__('SlideStore');
    App.__ResetDependency__('SessionStore');
  });

  describe('Rendering', () => {

    it('renders a TokenRequester by default', () => {
      let renderer = TestUtils.createRenderer();
      mockSessionStore.requestedToken = false;
      renderer.render(<App />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.deepEqual(
        result.props.children,
        <TokenRequester didRequestToken={false} />
      );
    });

    it ('renders a SlideViewer if the token was already requested', () => {
      let renderer = TestUtils.createRenderer();
      mockSessionStore.requestedToken = true;
      mockSessionStore.presenter = true;
      renderer.render(<App />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.deepEqual(
        result.props.children,
        <SlideViewer
          channel={fakeChannel}
          isPresenter={true}
          slide={fakeSlide}
        />
      );
    });

  });

});
