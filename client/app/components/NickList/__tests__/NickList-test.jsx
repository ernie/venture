import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import NickList from '../NickList';
import styles from '../_NickList.scss';

let fakeNicks = [
  { id: 'bert', name: 'Bert' },
  { id: 'ernie', name: 'Ernie' },
  { id: 'lurker', name: null }
];

let mockChatActions = {

  clickedNick: '',

  nickClicked(nick) {
    this.clickedNick = nick;
  }

};

describe('NickList', () => {

  before( () => {
    NickList.__Rewire__('ChatActions', mockChatActions);
  });

  after( () => {
    NickList.__ResetDependency__('ChatActions');
  });

  describe('Rendering', () => {
    let renderer = TestUtils.createRenderer();
    let component = renderer.render(
      <NickList
        active={true}
        nicks={fakeNicks}
      />
    );
    let result = renderer.getRenderOutput();
    assert.equal(result.type, 'div');
    let [header, lurkers, nicks] = result.props.children;

    assert.equal(header.type, 'div');
    assert.equal(header.props.children, "Who's here?");
    assert.equal(lurkers.type, 'div');
    assert.equal(lurkers.props.children, '1 lurker');
    assert.equal(nicks.type, 'div');
    let [bert, ernie] = nicks.props.children;
    assert.deepEqual(
      bert.props.children,
      <span>Bert</span>
    );
    assert.deepEqual(
      ernie.props.children,
      <span>Ernie</span>
    );
  });

  describe('Behavior', () => {

    it('triggers nickClicked on click of nick', () => {
      mockChatActions.clickedNick = 'unclicked';
      let component = TestUtils.renderIntoDocument(
        <NickList active={true} nicks={fakeNicks} />
      );
      let [bert] = TestUtils.scryRenderedDOMComponentsWithClass(
        component, styles.nick
      );
      TestUtils.Simulate.click(bert);
      assert.equal(mockChatActions.clickedNick, 'Bert');
    });

    it('does not trigger actions when inactive', () => {
      mockChatActions.clickedNick = 'unclicked';
      let component = TestUtils.renderIntoDocument(
        <NickList active={false} nicks={fakeNicks} />
      );
      let [bert] = TestUtils.scryRenderedDOMComponentsWithClass(
        component, styles.nick
      );
      TestUtils.Simulate.click(bert);
      assert.equal(mockChatActions.clickedNick, 'unclicked');
    });

  });

});
