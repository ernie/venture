import React, { useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import SlideActions from "../../actions/SlideActions";
import SelectionsStore from "../../stores/SelectionsStore";

import Markdown from "../../Markdown";
import classNames from "classnames";

function getState() {
  return {
    selections: SelectionsStore.get()
  } as PollSlideState;
}

interface PollSlideProps {
  options:  Array<string>;
  content:  string;
  channel:  Channel;
  active:   boolean;
}

interface PollSlideState {
  selections:  object;
  selected?:    string;
}

const PollSlide = ({ options, content, channel, active = true }: PollSlideProps) => {
  const [state, setState] = useState(getState);
  useLayoutEffect(() => {
    SelectionsStore.addChangeListener(handleChange);
    return () => {
      SelectionsStore.removeChangeListener(handleChange);
    };
  }, []);

  const selectOption = (e: React.UIEvent<HTMLLIElement>) => {
    setState({ ...state, selected: e.currentTarget.dataset.option });
    SlideActions.selectOption(channel, e.currentTarget.dataset.option);
  }

  const handleChange = () => {
    setState(getState);
  }

  const maxSelections = () => {
    let max = 0;
    let selections = state.selections;
    for (var key in selections) {
      if (selections.hasOwnProperty(key)) {
        if (selections[key] > max) {
          max = selections[key];
        }
      }
    }
    return max;
  }

  const stylesFor = (option: string) => {
    let max = maxSelections();
    if (max === 0) {
      return { width: 0 }
    } else {
      return { width: `${(state.selections[option] / max * 100)}%` }
    }
  }

  const renderOption = (option: string) => {
    let max = maxSelections();
    let selected = (state.selected === option ? "selected" : null);
    let winner = null;
    if (max > 0 && state.selections[option] === max) {
      winner = "winner";
    }
    return (
      <li
        className={classNames("pollOption", selected, winner)}
        data-option={option}
        key={option}
        onClick={active ? selectOption : null}
      >
        {option} ({state.selections[option] || 0})
        <div
          className="pollBar"
          style={stylesFor(option)}
        >
          {option} ({state.selections[option] || 0})
        </div>
      </li>
    );
  }

  return (
    <div className="content">
      <div
        className="markdown"
        dangerouslySetInnerHTML={
          { __html: Markdown.render(content) }
        }
      />
      <ul className="pollOptions">
        {options.map(renderOption)}
      </ul>
    </div>
  );

}

PollSlide.propTypes = {
  options: PropTypes.array.isRequired,
  content: PropTypes.string.isRequired,
  channel: PropTypes.object.isRequired,
  active: PropTypes.bool
}

export default PollSlide;
