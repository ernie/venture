import React from 'react';
import ReactDOM from 'react-dom';
import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import ChatInput from '../ChatInput';
import NickForm from '../../NickForm/NickForm';
import MessageForm from '../../MessageForm/MessageForm';

let fakeChannel = { fake: 'channel' };
let fakeNick = { id: 'zomgid', name: 'Ernie' };

describe('ChatInput', () => {

  describe('Rendering', () => {

    it('renders a NickForm if editing', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<ChatInput active={true} channel={fakeChannel} editing={true} nick={fakeNick} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.deepEqual(
        result.props.children,
        <NickForm active={true} channel={fakeChannel} nick={fakeNick} />
      );
    });

    it('renders a MessageForm if not editing', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<ChatInput active={true} channel={fakeChannel} editing={false} nick={fakeNick} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.deepEqual(
        result.props.children,
        <MessageForm active={true} channel={fakeChannel} nick={fakeNick} />
      );
    });

  });

});
