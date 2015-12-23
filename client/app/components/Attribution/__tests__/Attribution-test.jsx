import React from 'react';
import ReactDOM from 'react-dom';
import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import Attribution from '../Attribution';

let renderer = TestUtils.createRenderer();

let content = "* line1\n* line2";

describe('Attribution', () => {

  describe('Rendering', () => {

    it('does not render with no content', () => {
      let result = renderer.render(
        <Attribution position="bottom right" />
      );
      assert.strictEqual(result, undefined);
    });

    it('renders with content', () => {
      renderer.render(
        <Attribution content={content} position="bottom right" />
      );
      let result = renderer.getRenderOutput();
      assert.strictEqual(result.type, 'div');
      let style = result.props.style;
      assert.strictEqual(style.bottom, 0);
      assert.strictEqual(style.right, 0);
      assert.strictEqual(style.textAlign, 'right');
      assert.strictEqual(
        result.props.dangerouslySetInnerHTML.__html,
        "<ul>\n<li>line1</li>\n<li>line2</li>\n</ul>\n"
      );
    });

  });

  describe('Positioning', () => {

    it('positions at bottom right', () => {
      renderer.render(
        <Attribution content={content} position="bottom right" />
      );
      let result = renderer.getRenderOutput();
      let style = result.props.style;
      assert.strictEqual(style.bottom, 0);
      assert.strictEqual(style.right, 0);
      assert.strictEqual(style.textAlign, 'right');
    });

    it('positions at bottom', () => {
      renderer.render(
        <Attribution content={content} position="bottom" />
      );
      let result = renderer.getRenderOutput();
      let style = result.props.style;
      assert.strictEqual(style.bottom, 0);
      assert.strictEqual(style.left, 0);
      assert.strictEqual(style.right, 0);
      assert.strictEqual(style.textAlign, 'center');
    });

    it('positions at bottom left', () => {
      renderer.render(
        <Attribution content={content} position="bottom left" />
      );
      let result = renderer.getRenderOutput();
      let style = result.props.style;
      assert.strictEqual(style.bottom, 0);
      assert.strictEqual(style.left, 0);
      assert.strictEqual(style.textAlign, 'left');
    });

    it('positions at left', () => {
      renderer.render(
        <Attribution content={content} position="left" />
      );
      let result = renderer.getRenderOutput();
      let style = result.props.style;
      assert.strictEqual(style.left, 0);
      assert.strictEqual(style.textAlign, 'left');
    });

    it('positions at right', () => {
      renderer.render(
        <Attribution content={content} position="right" />
      );
      let result = renderer.getRenderOutput();
      let style = result.props.style;
      assert.strictEqual(style.right, 0);
      assert.strictEqual(style.textAlign, 'right');
    });

    it('positions at top left', () => {
      renderer.render(
        <Attribution content={content} position="top left" />
      );
      let result = renderer.getRenderOutput();
      let style = result.props.style;
      assert.strictEqual(style.top, 0);
      assert.strictEqual(style.left, 0);
      assert.strictEqual(style.textAlign, 'left');
    });

    it('positions at top', () => {
      renderer.render(
        <Attribution content={content} position="top" />
      );
      let result = renderer.getRenderOutput();
      let style = result.props.style;
      assert.strictEqual(style.top, 0);
      assert.strictEqual(style.left, 0);
      assert.strictEqual(style.right, 0);
      assert.strictEqual(style.textAlign, 'center');
    });

    it('positions at top right', () => {
      renderer.render(
        <Attribution content={content} position="top right" />
      );
      let result = renderer.getRenderOutput();
      let style = result.props.style;
      assert.strictEqual(style.top, 0);
      assert.strictEqual(style.right, 0);
      assert.strictEqual(style.textAlign, 'right');
    });

  });

});
