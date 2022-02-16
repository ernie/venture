import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';

interface SlideProps {
  content: string;
  active: boolean;
}

export default class Slide extends React.Component<SlideProps> {

  static propTypes = {
    content: PropTypes.string.isRequired,
    active: PropTypes.bool
  }

  static defaultProps = {
    active: true,
    content: ''
  }

  render() {
    let { content } = this.props;
    return (
      <div
        className="content markdown slideMarkdown"
        dangerouslySetInnerHTML={{ __html: Markdown.render(content) }}
      />
    );
  }

}
