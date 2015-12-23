import React, { PropTypes } from 'react';

import styles from './_Notes.scss';
import slideStyles from '../Slide/_Slide.scss';

import Markdown from '../../../lib/Markdown';
import classNames from 'classnames';

export default class Notes extends React.Component {

  static propTypes = {
    notes: PropTypes.string.isRequired
  }

  static defaultProps = {
    notes: ''
  }

  render() {
    return (
      <div
        className={classNames(styles.notes, slideStyles.markdown)}
        dangerouslySetInnerHTML={
          { __html: Markdown.render(this.props.notes) }
        }
      />
    );
  }

}
