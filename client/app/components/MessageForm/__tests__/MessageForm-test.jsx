import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import MessageForm from '../MessageForm';
import styles from '../_MessageForm.scss';

let fakeChannel = { fake: 'channel' };
let fakeNick = { fake: 'nick', id: 'zomg', name: 'Ernie' };
let mockMessageStore = {

  history: [],
  message: '',
  changeListener: () => {},

  getHistory() {
    return this.history;
  },

  getMessage() {
    return this.message;
  },

  addChangeListener(func) {
    this.changeListener = func;
  },

  emitChange() {
    this.changeListener();
  }

};

let mockChatActions = {

  sentMessage: null,
  nickEditing: false,

  sendMessage(channel, message) {
    this.sentMessage = message;
  },

  editNick() {
    this.nickEditing = true;
  }

};

describe('MessageForm', () => {

  before( () => {
    MessageForm.__Rewire__('MessageStore', mockMessageStore);
    MessageForm.__Rewire__('ChatActions', mockChatActions);
  });

  after( () => {
    MessageForm.__ResetDependency__('MessageStore');
    MessageForm.__ResetDependency__('ChatActions');
  });

  describe('Rendering', () => {

    it('renders a button and a form', () => {
      mockMessageStore.message = 'An unsubmitted message';
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <MessageForm
          active={true}
          channel={fakeChannel}
          nick={fakeNick}
        />
      );
      let [button, form] = renderer.getRenderOutput().props.children;
      assert.equal(button.type, 'button');
      assert.deepEqual(button.props.children, <span>Ernie</span>);
      assert.equal(form.type, 'form');
      let [input, submit] = form.props.children;
      assert.equal(input.type, 'input');
      assert.equal(input.props.value, 'An unsubmitted message');
      assert.equal(submit.type, 'button');
      assert.equal(submit.props.type, 'submit');
    });

  });

  describe('Behavior', () => {

    it('triggers an editNick action on nick button press', () => {
      mockChatActions.nickEditing = false;
      let component = TestUtils.renderIntoDocument(
        <MessageForm
          active={true}
          channel={fakeChannel}
          nick={fakeNick}
        />
      );
      let nickButton = TestUtils.findRenderedDOMComponentWithClass(
        component, styles.nickButton
      );
      TestUtils.Simulate.click(nickButton);
      assert(mockChatActions.nickEditing);
    });

    it('handles input by updating state', () => {
      mockMessageStore.message = 'An unsubmitted message';
      mockChatActions.nickEditing = false;
      let component = TestUtils.renderIntoDocument(
        <MessageForm
          active={true}
          channel={fakeChannel}
          nick={fakeNick}
        />
      );
      assert.equal(component.state.message, 'An unsubmitted message');
      let input = component.refs.input;
      input.value = 'Updated text';
      TestUtils.Simulate.change(input);
      assert.equal(component.state.message, 'Updated text');
    });

    it('triggers a sendMessage action on form submission', () => {
      mockMessageStore.message = 'A message to submit';
      mockChatActions.sentMessage = null;
      let component = TestUtils.renderIntoDocument(
        <MessageForm
          active={true}
          channel={fakeChannel}
          nick={fakeNick}
        />
      );
      let form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
      TestUtils.Simulate.submit(form);
      assert.equal(mockChatActions.sentMessage, 'A message to submit');
    });

    it('allows navigation through sent message history via arrow keys', () => {
      mockMessageStore.message = 'A message';
      mockMessageStore.history = ['Message 3', 'Message 2', 'Message 1'];
      let component = TestUtils.renderIntoDocument(
        <MessageForm
          active={true}
          channel={fakeChannel}
          nick={fakeNick}
        />
      );
      let input = component.refs.input;
      TestUtils.Simulate.keyDown(input, { keyCode: 38 });
      assert.equal(component.state.message, 'Message 3');
      TestUtils.Simulate.keyDown(input, { keyCode: 38 });
      assert.equal(component.state.message, 'Message 2');
      TestUtils.Simulate.keyDown(input, { keyCode: 38 });
      assert.equal(component.state.message, 'Message 1');
      TestUtils.Simulate.keyDown(input, { keyCode: 38 });
      assert.equal(component.state.message, 'Message 1');
      TestUtils.Simulate.keyDown(input, { keyCode: 40 });
      assert.equal(component.state.message, 'Message 2');
      TestUtils.Simulate.keyDown(input, { keyCode: 40 });
      assert.equal(component.state.message, 'Message 3');
      TestUtils.Simulate.keyDown(input, { keyCode: 40 });
      assert.equal(component.state.message, '');
    });

    it('does not handle interactions when inactive', () => {
      mockMessageStore.message = 'A message';
      mockMessageStore.history = ['Message 3', 'Message 2', 'Message 1'];
      mockChatActions.sentMessage = null;
      mockChatActions.nickEditing = false;
      let component = TestUtils.renderIntoDocument(
        <MessageForm
          active={false}
          channel={fakeChannel}
          nick={fakeNick}
        />
      );
      let input = component.refs.input;
      TestUtils.Simulate.keyDown(input, { keyCode: 38 });
      assert.equal(component.state.message, 'A message');
      TestUtils.Simulate.keyDown(input, { keyCode: 40 });
      assert.equal(component.state.message, 'A message');

      let form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
      TestUtils.Simulate.submit(form);
      assert.isNull(mockChatActions.sentMessage);

      let nickButton = TestUtils.findRenderedDOMComponentWithClass(
        component, styles.nickButton
      );
      TestUtils.Simulate.click(nickButton);
      assert(!mockChatActions.nickEditing);
    });

  });

});
