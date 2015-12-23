import React from 'react';
import ReactDOM from 'react-dom';

import Immutable from 'immutable';

import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import MessageList from '../MessageList';
import Message from '../../Message/Message';
import MessageRecord from '../../../records/Message';
import styles from '../_MessageList.scss';

let fakeMessages = new Immutable.List(
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map( (n) => new MessageRecord({content: `Message ${n}`}) )
);

describe('MessageList', () => {

  describe('Rendering', () => {

    it('renders its messages', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<MessageList messages={fakeMessages} />);
      let result = renderer.getRenderOutput();
      let list = result.props.children;
      assert.equal(list.type, 'div');
      assert.deepEqual(
        list.props.children,
        fakeMessages.map( (m, i) => { return <Message key={i} message={m} /> })
      );
    });

  });

  describe('Behavior', () => {

    it('keeps track of whether the user has scrolled', () => {
      let div = document.createElement('div');
      document.body.appendChild(div)
      // We need to render into a div so it can actually have a height
      let component = ReactDOM.render(
        <MessageList messages={
          fakeMessages.concat(fakeMessages).concat(fakeMessages).concat(fakeMessages)
        } />,
        div
      );
      let messages = component.refs.messages;
      messages.scrollTop = messages.scrollHeight - messages.clientHeight;
      TestUtils.Simulate.scroll(messages);
      assert(!component.userScrolling);
      messages.scrollTop = 0;
      TestUtils.Simulate.scroll(messages);
      assert(component.userScrolling);
      ReactDOM.unmountComponentAtNode(div);
    });

  });

});
