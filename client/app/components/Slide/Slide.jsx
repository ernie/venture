import styles from './_Slide.scss';

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Markdown from '../../../lib/Markdown';

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
        className={classNames('content', 'markdown', styles.markdown)}
        dangerouslySetInnerHTML={{ __html: Markdown.render(content) }}
      />
    );
  }

}
