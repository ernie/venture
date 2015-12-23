import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';

import SlideContainer from '../SlideContainer';
import styles from '../_SlideContainer.scss';

import Filter from '../../Filter/Filter';
import Canvas from '../../Canvas/Canvas';

let fakeContent = '*Markdown* content';

let fakeChannel = { fake: 'channel' };

let fakeSlide = {
  type: 'slide',
  content: fakeContent,
  'class': 'dark',
  background: {
    image: 'foo.jpg',
    size: 'cover',
    repeat: 'no-repeat',
    position: 'center',
    color: '#f00'
  }
};

describe('SlideContainer', () => {

  before( () => { context.attr = 'hello!' } );

  describe('Rendering', () => {

    it('applies a class to the container if supplied', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <SlideContainer
          channel={fakeChannel}
          className={'myclass'}
          slide={fakeSlide}
        />
      );
      let result = renderer.getRenderOutput();
      assert.include(result.props.className, 'myclass');
    });

    it('renders a single slide with an appropriate style', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <SlideContainer
          channel={fakeChannel}
          className={'myclass'}
          slide={fakeSlide}
        />
      );
      let slide = renderer.getRenderOutput().props.children;
      assert.equal(slide.props.className, 'slide dark');
      assert.deepEqual(
        slide.props.style,
        {
          backgroundImage: 'url("/backgrounds/foo.jpg")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#f00'
        }
      );
    });

    it('renders a filter as first child of slide div', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <SlideContainer
          channel={fakeChannel}
          slide={fakeSlide}
        />
      );
      let slide = renderer.getRenderOutput().props.children;
      let [filter] = slide.props.children;
      assert.deepEqual(filter, <Filter slide={fakeSlide} />);
    });

    it('renders a Canvas as second child of slide div', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <SlideContainer
          channel={fakeChannel}
          slide={fakeSlide}
        />
      );
      let slide = renderer.getRenderOutput().props.children;
      let [_filter, canvas] = slide.props.children;
      assert.deepEqual(
        canvas,
        <Canvas active={true} channel={fakeChannel} slide={fakeSlide} />
      );
    });

  });

});
