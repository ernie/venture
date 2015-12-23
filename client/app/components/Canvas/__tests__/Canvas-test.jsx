import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';

import Canvas from '../Canvas';
import styles from '../_Canvas.scss';

import Slide from '../../Slide/Slide';
import Attribution from '../../Attribution/Attribution';

let fakeContent = '*Markdown* content';

let fakeChannel = { fake: 'channel' };

let fakeSlide = {
  type: 'slide',
  content: fakeContent,
  'class': 'dark',
  align: 'top right',
  attribution: {
    position: 'top right',
    content: 'hello, I am an attribution'
  },
  background: {
    image: 'foo.jpg',
    size: 'cover',
    repeat: 'no-repeat',
    position: 'center',
    color: '#f00'
  }
};

describe('Canvas', () => {

  describe('Rendering', () => {

    it('renders a div with class and style', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <Canvas active={true} channel={fakeChannel} slide={fakeSlide} />
      );
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.equal(result.props.className, 'canvas')
      assert.deepEqual(
        result.props.style,
        {
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          textAlign: 'right'
        }
      );
    });

    it('renders a slide as first child', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <Canvas active={true} channel={fakeChannel} slide={fakeSlide} />
      );
      let [slide] = renderer.getRenderOutput().props.children;
      assert.deepEqual(
        slide,
        <Slide active={true} content={fakeContent} />
      );
    });

    it('renders an attribution as second child', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <Canvas active={true} channel={fakeChannel} slide={fakeSlide} />
      );
      let [_slide, attribution] = renderer.getRenderOutput().props.children;
      assert.deepEqual(
        attribution,
        <Attribution
          content={'hello, I am an attribution'}
          position={'top right'}
        />
      );
    });

  });

});
