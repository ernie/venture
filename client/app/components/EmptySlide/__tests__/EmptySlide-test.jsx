import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import EmptySlide from '../EmptySlide';

describe('EmptySlide', () => {

  describe('Rendering', () => {

    it('renders "awaiting slide" message', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<EmptySlide />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.deepEqual(
        result.props.children,
        <p>Awaiting slide...</p>
      );
    });

  });

});
