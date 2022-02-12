import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Markdown from '../../Markdown';

export default class TitleSlide extends React.Component {

  static propTypes = {
    content: PropTypes.string.isRequired,
    active: PropTypes.bool
  }

  static defaultProps = {
    active: true
  }

  render() {
    let { content } = this.props;
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

}
