import React from 'react';
import ReactDOM from 'react-dom';

import { assert } from 'chai';

import TestUtils from 'react/lib/ReactTestUtils';
import ForkSlide from '../ForkSlide';
import styles from '../_ForkSlide.scss';
import SlideContainer from '../../SlideContainer/SlideContainer';

let fakeSlide1 = { fake: 'slide1', location: { story: 'fake1', index: 0 } };
let fakeSlide2 = { fake: 'slide2', location: { story: 'fake2', index: 0 } };
let fakePaths = [ fakeSlide1, fakeSlide2 ];
let fakeChannel = { fake: 'channel' };
let fakeContent = "Content *with formatting*";
let fakeSelections = { 'fake1:0': 0, 'fake2:0': 1 };
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

describe('ForkSlide', () => {

  before( () => {
    ForkSlide.__Rewire__('SelectionsStore', mockSelectionsStore);
    ForkSlide.__Rewire__('SlideActions', mockSlideActions);
    // We rewire SlideContainer due to an issue with cyclical dependencies and
    // rewire
    ForkSlide.__Rewire__('SlideContainer', SlideContainer);
  });

  after( () => {
    ForkSlide.__ResetDependency__('SelectionsStore');
    ForkSlide.__ResetDependency__('SlideActions');
    ForkSlide.__ResetDependency__('SlideContainer');
  });

  describe('Rendering', () => {

    it('renders the content', () => {
      let renderer = TestUtils.createRenderer();
      renderer.render(
        <ForkSlide
          channel={fakeChannel}
          content={fakeContent}
          paths={fakePaths}
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
        <ForkSlide
          channel={fakeChannel}
          content={fakeContent}
          paths={fakePaths}
        />
      );
      let [_markdown, list] = renderer.getRenderOutput().props.children;
      assert.equal(list.type, 'ul');
      let [option1, option2] = list.props.children;
      assert.equal(option1.props.className, styles.option);
      assert.deepEqual(
        option1.props.children,
        [
          <SlideContainer active={false} channel={fakeChannel} slide={fakeSlide1} />,
          <div className={styles.selectionCount}>{0}</div>
        ]
      );
      assert.include(option2.props.className, styles.winner);
      assert.deepEqual(
        option2.props.children,
        [
          <SlideContainer active={false} channel={fakeChannel} slide={fakeSlide2} />,
          <div className={styles.selectionCount}>{1}</div>
        ]
      );
    });

  });


  describe('Behavior', () => {

    it('selects an option and marks selected', () => {
      mockSelectionsStore.selections = fakeSelections;
      let component = TestUtils.renderIntoDocument(
        <ForkSlide
          channel={fakeChannel}
          content={fakeContent}
          paths={fakePaths}
        />
      );
      let options = TestUtils.scryRenderedDOMComponentsWithTag(component, 'li');
      let selectedList = TestUtils.scryRenderedDOMComponentsWithClass(
        component, styles.selected
      );
      assert.equal(0, selectedList.length);
      TestUtils.Simulate.click(options[0]);
      assert.equal(mockSlideActions.selectedOption, 'fake1:0')
      let selectedOption = TestUtils.findRenderedDOMComponentWithClass(component, styles.selected);
      assert.equal(selectedOption.dataset.option, 'fake1:0');
    });

    it('does not process clicks when inactive', () => {
      mockSelectionsStore.selections = fakeSelections;
      mockSlideActions.selectedOption = 'unselected';
      let component = TestUtils.renderIntoDocument(
        <ForkSlide
          active={false}
          channel={fakeChannel}
          content={fakeContent}
          paths={fakePaths}
        />
      );
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
