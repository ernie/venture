import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';

import PresenterOverlay from '../PresenterOverlay';
import styles from '../_PresenterOverlay.scss';

import PresenterControls from '../../PresenterControls/PresenterControls';
import ConnectionsDisplay from '../../ConnectionsDisplay/ConnectionsDisplay';
import Notes from '../../Notes/Notes';
import SlidePreview from '../../SlidePreview/SlidePreview';

let fakeSlide2 = {
  type: 'slide',
  content: 'This is the *second* slide',
  notes: 'notes for slide 2'
};

let fakeSlide1 = {
  type: 'slide',
  content: 'This is the *first* slide',
  next: fakeSlide2,
  notes: 'notes for slide 1'
};

let fakeChannel = { fake: 'channel' };

describe('PresenterOverlay', () => {

  describe('Rendering', () => {

    it('does not render an overlay if not presenter', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <PresenterOverlay
          channel={fakeChannel}
          isPresenter={false}
          slide={fakeSlide1}
        />
      );
      let result = renderer.getRenderOutput();
      assert.isNull(result);
    });

    it('renders an overlay if presenter', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <PresenterOverlay
          channel={fakeChannel}
          isPresenter={true}
          slide={fakeSlide1}
        />
      );
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.deepEqual(
        result.props.children,
        [
          <PresenterControls channel={fakeChannel} />,
          <ConnectionsDisplay />,
          <Notes notes={fakeSlide1.notes} />,
          <SlidePreview channel={fakeChannel} slide={fakeSlide2} />
        ]
      );
    });

  });

  describe('Behavior', () => {
  });

});
