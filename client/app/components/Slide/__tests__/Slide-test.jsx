import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';

import Slide from '../Slide';
import styles from '../_Slide.scss';

let fakeContent = 'Content *with formatting*';

describe('Slide', () => {

  describe('Rendering', () => {

    it('renders Markdown content', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<Slide content={fakeContent} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.include(result.props.className, styles.markdown);
      assert.deepEqual(
        result.props.dangerouslySetInnerHTML,
        { __html: "<p>Content <em>with formatting</em></p>\n" }
      );
    });

    it('renders an empty div if no content', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<Slide content={undefined} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.include(result.props.className, styles.markdown);
      assert.deepEqual(
        result.props.dangerouslySetInnerHTML,
        { __html: '' }
      );
    });

  });

});
