import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';

import SlideViewer from '../SlideViewer';
import styles from '../_SlideViewer.scss';

import PresenterOverlay from '../../PresenterOverlay/PresenterOverlay';
import SlideContainer from '../../SlideContainer/SlideContainer';

let fakeChannel = { fake: 'channel' };
let fakeSlide = { fake: 'slide' };

describe('SlideViewer', () => {

  describe('Rendering', () => {

    it('renders a div with styles.viewer class', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <SlideViewer
          channel={fakeChannel}
          isPresenter={true}
          slide={fakeSlide}
        />
      );
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.equal(result.props.className, styles.viewer);
    });

    it('renders a presenter overlay and slide container for presenter', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <SlideViewer
          channel={fakeChannel}
          isPresenter={true}
          slide={fakeSlide}
        />
      );
      let [overlay, container] = renderer.getRenderOutput().props.children;
      assert.deepEqual(
        overlay,
        <PresenterOverlay
          channel={fakeChannel}
          isPresenter={true}
          slide={fakeSlide}
        />
      );
      assert.deepEqual(
        container,
        <SlideContainer
          channel={fakeChannel}
          className={styles.presenter}
          slide={fakeSlide}
        />
      );
    });

    it('renders a presenter overlay and slide container for attendee', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <SlideViewer
          channel={fakeChannel}
          isPresenter={false}
          slide={fakeSlide}
        />
      );
      let [overlay, container] = renderer.getRenderOutput().props.children;
      assert.deepEqual(
        overlay,
        <PresenterOverlay
          channel={fakeChannel}
          isPresenter={false}
          slide={fakeSlide}
        />
      );
      assert.deepEqual(
        container,
        <SlideContainer
          channel={fakeChannel}
          className={styles.attendee}
          slide={fakeSlide}
        />
      );
    });

  });

});
