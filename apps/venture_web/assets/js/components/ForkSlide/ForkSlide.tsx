import React, { useState, useLayoutEffect } from "react";
import PropTypes from "prop-types";
import { Channel } from "phoenix";

import SlideActions from "../../actions/SlideActions";
import SelectionsStore from "../../stores/SelectionsStore";

import Markdown from "../../Markdown";
import classNames from "classnames";

import SlideContainer from "../SlideContainer/SlideContainer";

import { Slide } from "../../records/Slides";

function getState() {
  return {
    selections: SelectionsStore.get()
  } as ForkSlideState;
}

interface ForkSlideProps {
  paths: Array<Slide>;
  content: string;
  channel: Channel;
  active: boolean;
}

interface ForkSlideState {
  selections:  object;
  selected?:    string;
}

interface Location {
  story: string;
  index: number;
}

const ForkSlide = ({ paths, content, channel, active = true }: ForkSlideProps) => {
  const [state, setState] = useState(getState);
  useLayoutEffect(() => {
    SelectionsStore.addChangeListener(handleChange);
    return () => {
      SelectionsStore.removeChangeListener(handleChange);
    };
  }, []);

  const selectOption = (e: React.UIEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (active) {
      setState({...state, selected: e.currentTarget.dataset.option });
      SlideActions.selectOption(channel, e.currentTarget.dataset.option);
    }
  }

  const handleChange = () => {
    setState(getState);
  }

  const locationString = (loc: Location) => {
    return `${loc.story}:${loc.index}`;
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

  const renderPath = (pathSlide: Slide) => {
    let max = maxSelections();
    let location = locationString(pathSlide.location);
    let selected = (state.selected === location ? "selected" : null);
    let winner = null;
    if (max > 0 && state.selections[location] === max) {
      winner = "winner";
    }
    return (
      <li
        className={classNames("forkOption", selected, winner)}
        data-option={location}
        key={location}
        onClick={selectOption}>
        <SlideContainer
          active={false}
          channel={channel}
          slide={pathSlide}
        />
        <div className="forkSelectionCount">
          {state.selections[location] || 0}
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
      <ul className="forkOptions">
        {paths.map(renderPath)}
      </ul>
    </div>
  );

}
ForkSlide.propTypes = {
  paths: PropTypes.array.isRequired,
  content: PropTypes.string.isRequired,
  channel: PropTypes.object.isRequired,
  active: PropTypes.bool
}

export default ForkSlide;
