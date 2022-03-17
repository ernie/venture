import React, { useState, useLayoutEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { Location, SlideState, optionSelect, selectSelections } from "./presentationSlice";

import Markdown from "../../Markdown";
import classNames from "classnames";

import SlideContainer from "./SlideContainer";

interface ForkSlideProps {
  paths: Array<SlideState>;
  content: string;
  active: boolean;
}

const ForkSlide = ({ paths, content, active = true }: ForkSlideProps) => {
  const dispatch = useAppDispatch();
  const selections = useAppSelector(selectSelections);
  const [selected, setSelected] = useState(null);

  const optionClicked = (e: React.UIEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (active) {
      setSelected(e.currentTarget.dataset.option);
      dispatch(optionSelect(e.currentTarget.dataset.option));
    }
  }

  const locationString = (loc: Location) => {
    return `${loc.story}:${loc.index}`;
  }

  const maxSelections = () => {
    let max = 0;
    for (var key in selections) {
      if (selections.hasOwnProperty(key)) {
        if (selections[key] > max) {
          max = selections[key];
        }
      }
    }
    return max;
  }

  const renderPath = (pathSlide: SlideState) => {
    let max = maxSelections();
    let option = locationString(pathSlide.location);
    let winner = null;
    if (max > 0 && selections[option] === max) {
      winner = "winner";
    }
    return (
      <li
        className={classNames("forkOption", (selected === option ? "selected" : null), winner)}
        data-option={option}
        key={option}
        onClick={optionClicked}>
        <SlideContainer
          active={false}
          slide={pathSlide}
        />
        <div className="forkSelectionCount">
          {selections[option] || 0}
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

export default ForkSlide;
