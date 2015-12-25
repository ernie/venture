import slideStyles from '../Slide/_Slide.scss';
import styles from './_TitleSlide.scss';

import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Markdown from '../../../lib/Markdown';

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
            'content', 'markdown', slideStyles.markdown, styles.markdown
          )
        }
        dangerouslySetInnerHTML={{ __html: Markdown.render(content) }}
      />
    );
  }

}
