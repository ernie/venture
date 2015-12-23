import styles from './_SlideViewer.scss';

import React, { PropTypes } from 'react';
import SlideStore from '../../stores/SlideStore';

import SlideContainer from '../SlideContainer/SlideContainer';
import PresenterOverlay from '../PresenterOverlay/PresenterOverlay';

import classNames from 'classnames';

export default class SlideViewer extends React.Component {

  static propTypes = {
    slide: PropTypes.object.isRequired,
    isPresenter: PropTypes.bool.isRequired,
    channel: PropTypes.object.isRequired
  }

  render() {
    let { isPresenter, slide, channel } = this.props;
    let className = isPresenter ? styles.presenter : styles.attendee;
    return (
      <div className={styles.viewer}>
        <PresenterOverlay
          channel={channel}
          isPresenter={isPresenter}
          slide={slide}
        />
        <SlideContainer
          channel={channel}
          className={className}
          slide={slide}
        />
      </div>
    );
  }

}
