import React from 'react';
import classNames from 'classnames';
import Markdown from '../../Markdown';

interface TitleSlideProps {
  content: string;
}

const TitleSlide = ({ content }: TitleSlideProps) => {

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

export default TitleSlide;
