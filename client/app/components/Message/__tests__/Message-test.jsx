import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import Message from '../Message';
import styles from '../_Message.scss';
import MessageRecord from '../../../records/Message';

let message = new MessageRecord({
  type: 'emote',
  sender: 'Ernie',
  recipient: null,
  content: 'dances'
});

describe('Message', () => {

  describe('Rendering', () => {

    it('renders the nick a message is from', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<Message message={message} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      let [nickDiv] = result.props.children;
      assert.equal(nickDiv.props.title, 'Ernie');
      assert.deepEqual(
        nickDiv.props.children,
        <span>Ernie</span>
      );
    });

    it('renders the message body with a class for the messageType', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<Message message={message} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      let [nickDiv, messageDiv] = result.props.children;
      assert.include(messageDiv.props.className, styles.emote);
      assert.include(messageDiv.props.children, 'dances');
    });

    it('renders an outbound private message', () => {
      let outbound = new MessageRecord({
        type: 'priv_out',
        sender: 'Ernie',
        recipient: 'Bob',
        content: 'Hi, Bob!'
      });
      let renderer = TestUtils.createRenderer();
      renderer.render(<Message message={outbound} />);
      let result = renderer.getRenderOutput();
      let [nickDiv, messageDiv] = result.props.children;
      let [indicator, content] = messageDiv.props.children;
      assert.equal(indicator.type, 'div');
      assert.deepEqual(
        indicator,
        <div className={styles.indicator}>
          &rarr; {'Bob'}
        </div>
      );
      assert.equal(content, 'Hi, Bob!');
    });

    it('renders an inbound private message', () => {
      let inbound = new MessageRecord({
        type: 'priv_in',
        sender: 'Bob',
        recipient: 'Ernie',
        content: 'Hi, Ernie!'
      });
      let renderer = TestUtils.createRenderer();
      renderer.render(<Message message={inbound} />);
      let result = renderer.getRenderOutput();
      let [nickDiv, messageDiv] = result.props.children;
      let [indicator, content] = messageDiv.props.children;
      assert.equal(indicator.type, 'div');
      assert.deepEqual(
        indicator,
        <div className={styles.indicator}>
          &rarr; you
        </div>
      );
      assert.equal(content, 'Hi, Ernie!');
    });

  });

});
