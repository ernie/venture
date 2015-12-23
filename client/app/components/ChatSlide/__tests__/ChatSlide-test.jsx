import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import ChatSlide from '../ChatSlide';

import ChatInput from '../../ChatInput/ChatInput';
import MessageList from '../../MessageList/MessageList';
import NickList from '../../NickList/NickList';

let ernie = { id: 'zomg-ernie', name: 'Ernie' };
let bob = { id: 'zomg-bob', name: 'Bob' };
let fakeNicks = [bob, ernie];
let fakeMessages = new Immutable.List([
  {
    type: 'normal',
    sender: 'Ernie',
    recipient: undefined,
    content: 'Hi, everyone!'
  },
  {
    type: 'privmsg_out',
    sender: 'Ernie',
    recipient: 'Bob',
    content: 'Hi, Bob!'
  },
  {
    type: 'privmsg_in',
    sender: 'Bob',
    recipient: 'Ernie',
    content: 'Hi, Ernie!'
  }
]);
let fakeChannel = { fake: 'channel' };

let mockChatStore = {

  editing: true,
  channel: fakeChannel,
  nick: ernie,
  nicks: fakeNicks,
  messages: fakeMessages,

  isEditing() {
    return this.editing;
  },

  getChannel() {
    return this.channel;
  },

  getNick() {
    return this.nick;
  },

  getNicks() {
    return this.nicks;
  },

  getMessages() {
    return this.messages;
  }

}

describe('ChatSlide', () => {

  before( () => {
    ChatSlide.__Rewire__('ChatStore', mockChatStore);
  });

  after( () => {
    ChatSlide.__ResetDependency__('ChatStore');
  });

  describe('Rendering', () => {

    it('renders a MessageList, NickList, and ChatInput with state', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<ChatSlide active={true} content={''} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.deepEqual(
        result.props.children,
        [
          <MessageList messages={fakeMessages} />,
          <NickList active={true} nicks={fakeNicks} />,
          <ChatInput
            active={true}
            channel={fakeChannel}
            editing={true}
            nick={ernie}
          />
        ]
      );
    });

  });

});
