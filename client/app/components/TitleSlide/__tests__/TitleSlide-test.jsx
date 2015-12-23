import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';

import TitleSlide from '../TitleSlide';
import styles from '../_TitleSlide.scss';
import slideStyles from '../../Slide/_Slide.scss';

let fakeContent = 'Content *with formatting*';

describe('TitleSlide', () => {

  describe('Rendering', () => {

    it('renders Markdown content with both markdown classes', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<TitleSlide content={fakeContent} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.include(result.props.className, slideStyles.markdown);
      assert.include(result.props.className, styles.markdown);
      assert.deepEqual(
        result.props.dangerouslySetInnerHTML,
        { __html: "<p>Content <em>with formatting</em></p>\n" }
      );
    });

  });

});
