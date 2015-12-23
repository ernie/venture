import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';

import SlidePreview from '../SlidePreview';
import styles from '../_SlidePreview.scss';
import SlideContainer from '../../SlideContainer/SlideContainer';

let fakeSlide = {
  type: 'slide',
  content: 'hi2u'
};

let fakeChannel = { fake: 'channel' };

describe('SlidePreview', () => {

  describe('Rendering', () => {

    it('renders nothing if no slide', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<SlidePreview channel={fakeChannel} slide={undefined} />);
      let result = renderer.getRenderOutput();
      assert.isNull(result);
    });

    it('renders a slide container for a provided slide', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<SlidePreview channel={fakeChannel} slide={fakeSlide} />);
      let result = renderer.getRenderOutput();
      assert.deepEqual(
        result,
        <SlideContainer
          active={false}
          channel={fakeChannel}
          className={styles.preview}
          slide={fakeSlide}
        />
      );
    });

  });

});
