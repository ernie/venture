import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';

interface SlideProps {
  content: string;
  active: boolean;
}

const Slide = ({content = "", active = true}: SlideProps) => {

  return (
    <div
      className="content markdown slideMarkdown"
      dangerouslySetInnerHTML={{ __html: Markdown.render(content) }}
    />
  );

}

Slide.propTypes = {
  content: PropTypes.string,
  active: PropTypes.bool.isRequired
}

export default Slide;
