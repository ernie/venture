import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';

export default class Slide extends React.Component {

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
