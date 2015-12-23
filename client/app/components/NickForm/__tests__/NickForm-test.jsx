import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import NickForm from '../NickForm';
import styles from '../_NickForm.scss';

let fakeNick = { id: 'zomg', name: 'Ernie' };
let fakeChannel = { fake: 'channel' };

let mockChatActions = {

  nick: '',

  setNick(_channel, nick) {
    this.nick = nick;
  }

};

describe('NickForm', () => {

  before( () => {
    NickForm.__Rewire__('ChatActions', mockChatActions);
  });

  after( () => {
    NickForm.__ResetDependency__('ChatActions');
  });

  describe('Rendering', () => {

    it('renders a form', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <NickForm
          active={true}
          channel={fakeChannel}
          nick={fakeNick}
        />
      );
      let form = renderer.getRenderOutput();
      assert.equal(form.type, 'form');
      let [input, button] = form.props.children;
      assert.equal(input.type, 'input');
      assert.equal(input.ref, 'input');
      assert.equal(input.props.value, 'Ernie');
      assert.equal(button.type, 'button');
      assert.equal(button.props.children, 'Set Nick');
    });
  });

  describe('Behavior', () => {

    it('updates its state when text is entered', () => {
      let component = TestUtils.renderIntoDocument(
        <NickForm
          active={true}
          channel={fakeChannel}
          nick={fakeNick}
        />
      );
      assert.equal(component.state.name, 'Ernie');
      let input = component.refs.input;
      input.value = 'Bert';
      TestUtils.Simulate.change(input);
      assert.equal(component.state.name, 'Bert');
    });

    it('triggers the setNick action on submit', () => {
      mockChatActions.nick = 'unset';
      let component = TestUtils.renderIntoDocument(
        <NickForm
          active={true}
          channel={fakeChannel}
          nick={fakeNick}
        />
      );
      let form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
      TestUtils.Simulate.submit(form);
      assert.equal(mockChatActions.nick, 'Ernie');
    });

    it('does not handle interactions when inactive', () => {
      mockChatActions.nick = 'unset';
      let component = TestUtils.renderIntoDocument(
        <NickForm
          active={false}
          channel={fakeChannel}
          nick={fakeNick}
        />
      );
      let input = component.refs.input;
      input.value = 'Bert';
      TestUtils.Simulate.change(input);
      assert.equal(component.state.name, 'Ernie');
      let form = TestUtils.findRenderedDOMComponentWithTag(component, 'form');
      TestUtils.Simulate.submit(form);
      assert.equal(mockChatActions.nick, 'unset');
    });

  });

});
