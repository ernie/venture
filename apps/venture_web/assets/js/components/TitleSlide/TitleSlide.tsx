import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Markdown from '../../Markdown';

interface TitleSlideProps {
  content: string;
  active: boolean;
}

const TitleSlide = ({ content, active = true }: TitleSlideProps) => {

  return (
    <div
      className={
        classNames(
          "content", "markdown"
        )
      }
      dangerouslySetInnerHTML={{ __html: Markdown.render(content) }}
    />
  );

}
TitleSlide.propTypes = {
  content: PropTypes.string.isRequired,
  active: PropTypes.bool
}

export default TitleSlide;
