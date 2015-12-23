import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';

import Notes from '../Notes';
import styles from '../_Notes.scss';

let fakeContent = 'Content *with formatting*';

describe('Notes', () => {

  describe('Rendering', () => {

    it('renders markdown in notes', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<Notes notes={fakeContent} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.deepEqual(
        result.props.dangerouslySetInnerHTML,
        { __html: "<p>Content <em>with formatting</em></p>\n" }
      );
    });

    it('renders an empty div if no notes', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<Notes notes={undefined} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.deepEqual(
        result.props.dangerouslySetInnerHTML,
        { __html: '' }
      );
    });

  });

});
