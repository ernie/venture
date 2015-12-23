import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import PollSlide from '../PollSlide';
import styles from '../_PollSlide.scss';

let fakeOption1 = 'fake option 1';
let fakeOption2 = 'fake option 2';
let fakeOptions = [ fakeOption1, fakeOption2 ];
let fakeChannel = { fake: 'channel' };
let fakeContent = "Content *with formatting*";
let fakeSelections = { 'fake option 1': 0, 'fake option 2': 1 };
let mockSlideActions = {
  selectedOption: null,

  selectOption(channel, option) {
    this.selectedOption = option;
  }
};

let mockSelectionsStore = {

  selections: fakeSelections,
  changeListener: () => {},

  get() {
    return this.selections;
  },

  addChangeListener(func) {
    this.changeListener = func;
  },

  emitChange() {
    this.changeListener();
  }

};


describe('PollSlide', () => {

  before( () => {
    PollSlide.__Rewire__('SelectionsStore', mockSelectionsStore);
    PollSlide.__Rewire__('SlideActions', mockSlideActions);
  });

  after( () => {
    PollSlide.__ResetDependency__('SelectionsStore');
    PollSlide.__ResetDependency__('SlideActions');
  });

  describe('Rendering', () => {

    it('renders the content', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <PollSlide
          channel={fakeChannel}
          content={fakeContent}
          options={fakeOptions}
        />
      );
      let result = renderer.getRenderOutput();
      assert.equal(result.type, 'div');
      let [markdown] = result.props.children;
      assert.deepEqual(
        markdown.props.dangerouslySetInnerHTML,
        { __html: "<p>Content <em>with formatting</em></p>\n" }
      );
    });

    it('renders a list of options and marks the winner', () => {
      mockSelectionsStore.selections = fakeSelections;
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <PollSlide
          channel={fakeChannel}
          content={fakeContent}
          options={fakeOptions}
        />
      );
      let [_markdown, list] = renderer.getRenderOutput().props.children;
      assert.equal(list.type, 'ul');
      let [option1, option2] = list.props.children;
      assert.equal(option1.props.className, styles.option);
      assert.deepEqual(
        option1.props.children,
        [
          'fake option 1', ' (', 0, ')',
          <div className={styles.bar} style={ { width: '0%' } }>
            {'fake option 1'} ({0})
          </div>
        ]
      );
      assert.include(option2.props.className, styles.winner);
      assert.deepEqual(
        option2.props.children,
        [
          'fake option 2', ' (', 1, ')',
          <div className={styles.bar} style={ { width: '100%' } }>
            {'fake option 2'} ({1})
          </div>
        ]
      );
    });

  });

  describe('Behavior', () => {

    it('selects an option and marks selected', () => {
      mockSelectionsStore.selections = fakeSelections;
      let component = TestUtils.renderIntoDocument(
        <PollSlide
          channel={fakeChannel}
          content={fakeContent}
          options={fakeOptions}
        />
      );
      let options = TestUtils.scryRenderedDOMComponentsWithTag(component, 'li');
      let selectedList = TestUtils.scryRenderedDOMComponentsWithClass(
        component, styles.selected
      );
      assert.equal(0, selectedList.length);
      TestUtils.Simulate.click(options[0]);
      assert.equal(mockSlideActions.selectedOption, 'fake option 1')
      let selectedOption = TestUtils.findRenderedDOMComponentWithClass(component, styles.selected);
      assert.equal(selectedOption.dataset.option, 'fake option 1');
    });

    it('does not process clicks when inactive', () => {
      mockSelectionsStore.selections = fakeSelections;
      mockSlideActions.selectedOption = 'unselected';
      let component = TestUtils.renderIntoDocument(
        <PollSlide
          active={false}
          channel={fakeChannel}
          content={fakeContent}
          options={fakeOptions}
        />
      );
      let rendered = ReactDOM.findDOMNode(component);
      let options = TestUtils.scryRenderedDOMComponentsWithTag(component, 'li');
      let selectedList = TestUtils.scryRenderedDOMComponentsWithClass(
        component, styles.selected
      );
      assert.equal(0, selectedList.length);
      TestUtils.Simulate.click(options[0]);
      assert.equal(mockSlideActions.selectedOption, 'unselected')
      selectedList = TestUtils.scryRenderedDOMComponentsWithClass(
        component, styles.selected
      );
      assert.equal(0, selectedList.length);
    });

  });

});
