import styles from './_SlidePreview.scss';

import React, { PropTypes } from 'react';

import SlideContainer from '../SlideContainer/SlideContainer';

export default class SlidePreview extends React.Component {

  static propTypes = {
    channel: PropTypes.object.isRequired,
    slide: PropTypes.object
  }

  render() {
    if (this.props.slide) {
      return (
        <SlideContainer
          active={false}
          channel={this.props.channel}
          className={styles.preview}
          slide={this.props.slide}
        />
      );
    } else {
      return false;
    }
  }

}
