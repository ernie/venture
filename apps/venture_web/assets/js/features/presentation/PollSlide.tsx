import React, { useState, useLayoutEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { optionSelect, selectSelections } from "./presentationSlice";

import Markdown from "../../Markdown";
import classNames from "classnames";

interface PollSlideProps {
  options:  Array<string>;
  content:  string;
  active:   boolean;
}

const PollSlide = ({ options, content, active = true }: PollSlideProps) => {
  const dispatch = useAppDispatch();
  const selections = useAppSelector(selectSelections);
  const [selected, setSelected] = useState(null);

  const optionClicked = (e: React.UIEvent<HTMLLIElement>) => {
    setSelected(e.currentTarget.dataset.option);
    dispatch(optionSelect(e.currentTarget.dataset.option));
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

  const stylesFor = (option: string) => {
    let max = maxSelections();
    if (max === 0) {
      return { width: 0 }
    } else {
      return { width: `${(selections[option] / max * 100)}%` }
    }
  }

  const renderOption = (option: string) => {
    let max = maxSelections();
    let winner = null;
    if (max > 0 && selections[option] === max) {
      winner = "winner";
    }
    return (
      <li
        className={classNames("pollOption", (selected === option ? "selected" : null), winner)}
        data-option={option}
        key={option}
        onClick={active ? optionClicked : null}
      >
        {option} ({selections[option] || 0})
        <div
          className="pollBar"
          style={stylesFor(option)}
        >
          {option} ({selections[option] || 0})
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

export default PollSlide;
