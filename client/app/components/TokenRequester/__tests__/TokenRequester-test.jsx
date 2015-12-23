import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';
import TestUtils from 'react/lib/ReactTestUtils';

import TokenRequester from '../TokenRequester';
import styles from '../_TokenRequester.scss';

let mockSessionActions = {

  skippedToken: false,
  token: '',

  skipToken() {
    this.skippedToken = true;
  },

  setToken(token) {
    this.token = token;
  }

};

describe('TokenRequester', () => {

  before( () => {
    TokenRequester.__Rewire__('SessionActions', mockSessionActions);
  });

  after( () => {
    TokenRequester.__ResetDependency__('SessionActions');
  });

  describe('Rendering', () => {

    it('does not render if token was requested', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<TokenRequester didRequestToken={true} />);
      let result = renderer.getRenderOutput();
      assert.isNull(result);
    });

    it('renders if token was not requested', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(<TokenRequester didRequestToken={false} />);
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      assert.equal(result.props.className, styles.requester);
      let [attendeeLink, presenterLink, form] = result.props.children;
      assert.equal(attendeeLink.type, 'p');
      assert.equal(attendeeLink.props.className, styles.attendeeLink);
      assert.equal(presenterLink.type, 'p');
      assert.equal(presenterLink.props.className, styles.presenterLink);
      assert.equal(form.type, 'form');
      assert.equal(form.props.className, styles.form);
    });

  });

  describe('Behavior', () => {

    it('skips the token on click of attendee link', () => {
      mockSessionActions.skippedToken = false;
      let component = TestUtils.renderIntoDocument(
        <TokenRequester didRequestToken={false} />
      );
      let [attendeeLink] = TestUtils.findAllInRenderedTree(
        component,
        (inst) => TestUtils.isDOMComponent(inst) &&
                  inst.tagName.toUpperCase() === 'A' &&
                  inst.innerText === "I'm an attendee!"
      );
      TestUtils.Simulate.click(attendeeLink);
      assert.isTrue(mockSessionActions.skippedToken);
    });

    it('shows the presenter form on click of presenter link', () => {
      let component = TestUtils.renderIntoDocument(
        <TokenRequester didRequestToken={false} />
      );
      assert.equal(component.refs.form.style.display, '');
      assert.equal(component.refs.presenterLink.style.display, '');
      let [presenterLink] = TestUtils.findAllInRenderedTree(
        component,
        (inst) => TestUtils.isDOMComponent(inst) &&
                  inst.tagName.toUpperCase() === 'A' &&
                  inst.innerText === "I'm just the presenter"
      );
      TestUtils.Simulate.click(presenterLink);
      assert.equal(component.refs.presenterLink.style.display, 'none');
      assert.equal(component.refs.form.style.display, 'block');
    });

    it('sets the token on submit of presenter form', () => {
      mockSessionActions.token = '';
      let component = TestUtils.renderIntoDocument(
        <TokenRequester didRequestToken={false} />
      );
      component.refs.token.value = 'my-token';
      TestUtils.Simulate.submit(component.refs.form);
      assert.equal(mockSessionActions.token, 'my-token');
    });

  });

});
