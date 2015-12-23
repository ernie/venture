import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';

import Filter from '../Filter';
import styles from '../_Filter.scss';

let darkSlide = {
  background: {
    darken: 0.75
  }
};

let lightSlide = {
  background: {
    lighten: 0.25
  }
};

describe('Filter', () => {

  describe('Rendering', () => {

    it('sets color and opacity on darken', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<Filter slide={darkSlide} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.equal(result.props.className, 'filter');
      assert.deepEqual(
        result.props.style,
        {backgroundColor: '#000', opacity: 0.75}
      );
    });

    it('sets color and opacity on lighten', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<Filter slide={lightSlide} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.equal(result.props.className, 'filter');
      assert.deepEqual(
        result.props.style,
        {backgroundColor: '#fff', opacity: 0.25}
      );
    });

  });

});
