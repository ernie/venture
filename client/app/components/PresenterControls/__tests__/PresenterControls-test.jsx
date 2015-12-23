import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
// We can't use TestUtils.Simulate to trigger events bound to window
import { keyPress } from '../../../../lib/test_helpers';
import TestUtils from 'react/lib/ReactTestUtils';

import PresenterControls from '../PresenterControls';
import styles from '../_PresenterControls.scss';

let fakeChannel = { fake: 'channel' };

let mockSlideActions = {

  lastAction: '',

  nextSlide(_channel) {
    this.lastAction = 'next';
  },

  prevSlide(_channel) {
    this.lastAction = 'prev';
  },

  resetPresentation(_channel) {
    this.lastAction = 'reset';
  },

  reloadDeck(_channel) {
    this.lastAction = 'reload';
  }

};

describe('PresenterControls', () => {

  before( () => {
    PresenterControls.__Rewire__('SlideActions', mockSlideActions);
  });

  after( () => {
    PresenterControls.__ResetDependency__('SlideActions');
  });

  describe('Rendering', () => {

    it('renders buttons for controlling presentation', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<PresenterControls channel={fakeChannel} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      let [left, right] = result.props.children;
      let [prev, next] = left.props.children;
      let [reset, reload] = right.props.children;
      assert.isFunction(prev.props.onClick);
      assert.equal(prev.props.children, 'Prev');
      assert.isFunction(next.props.onClick);
      assert.equal(next.props.children, 'Next');
      assert.isFunction(reset.props.onClick);
      assert.equal(reset.props.children, 'Reset');
      assert.isFunction(reload.props.onClick);
      assert.equal(reload.props.children, 'Reload');
    });

  });

  describe('Behavior', () => {

    it('advances to next slide on next button click', () => {
      mockSlideActions.lastAction = '';
      let component = TestUtils.renderIntoDocument(
        <PresenterControls channel={fakeChannel} />
      );
      let [nextButton] = TestUtils.findAllInRenderedTree(
        component, (c) => c.innerText === 'Next'
      );
      TestUtils.Simulate.click(nextButton);
      assert.equal(mockSlideActions.lastAction, 'next');
    });

    it('advances to next slide on space', () => {
      mockSlideActions.lastAction = '';
      let component = TestUtils.renderIntoDocument(
        <PresenterControls channel={fakeChannel} />
      );
      keyPress(window, 32);
      assert.equal(mockSlideActions.lastAction, 'next');
    });

    it('advances to next slide on right arrow', () => {
      mockSlideActions.lastAction = '';
      let component = TestUtils.renderIntoDocument(
        <PresenterControls channel={fakeChannel} />
      );
      keyPress(window, 34);
      assert.equal(mockSlideActions.lastAction, 'next');
    });

    it('advances to next slide on page down', () => {
      mockSlideActions.lastAction = '';
      let component = TestUtils.renderIntoDocument(
        <PresenterControls channel={fakeChannel} />
      );
      keyPress(window, 39);
      assert.equal(mockSlideActions.lastAction, 'next');
    });

    it('returns to previous slide on prev button click', () => {
      mockSlideActions.lastAction = '';
      let component = TestUtils.renderIntoDocument(
        <PresenterControls channel={fakeChannel} />
      );
      let [prevButton] = TestUtils.findAllInRenderedTree(
        component, (c) => c.innerText === 'Prev'
      );
      TestUtils.Simulate.click(prevButton);
      assert.equal(mockSlideActions.lastAction, 'prev');
    });

    it('returns to previous slide on page up', () => {
      mockSlideActions.lastAction = '';
      let component = TestUtils.renderIntoDocument(
        <PresenterControls channel={fakeChannel} />
      );
      keyPress(window, 33);
      assert.equal(mockSlideActions.lastAction, 'prev');
    });

    it('returns to previous slide on left arrow', () => {
      mockSlideActions.lastAction = '';
      let component = TestUtils.renderIntoDocument(
        <PresenterControls channel={fakeChannel} />
      );
      keyPress(window, 37);
      assert.equal(mockSlideActions.lastAction, 'prev');
    });

    it('resets presentation on reset button click', () => {
      mockSlideActions.lastAction = '';
      let component = TestUtils.renderIntoDocument(
        <PresenterControls channel={fakeChannel} />
      );
      let [resetButton] = TestUtils.findAllInRenderedTree(
        component, (c) => c.innerText === 'Reset'
      );
      TestUtils.Simulate.click(resetButton);
      assert.equal(mockSlideActions.lastAction, 'reset');
    });

    it('reloads deck on reset button click', () => {
      mockSlideActions.lastAction = '';
      let component = TestUtils.renderIntoDocument(
        <PresenterControls channel={fakeChannel} />
      );
      let [reloadButton] = TestUtils.findAllInRenderedTree(
        component, (c) => c.innerText === 'Reload'
      );
      TestUtils.Simulate.click(reloadButton);
      assert.equal(mockSlideActions.lastAction, 'reload');
    });

  });

});
