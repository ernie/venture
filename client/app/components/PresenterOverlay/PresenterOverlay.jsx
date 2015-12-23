import styles from './_PresenterOverlay.scss';

import React, { PropTypes } from 'react';
import PresenterControls from '../PresenterControls/PresenterControls';
import ConnectionsDisplay from '../ConnectionsDisplay/ConnectionsDisplay';
import Notes from '../Notes/Notes';
import SlidePreview from '../SlidePreview/SlidePreview';

export default class PresenterOverlay extends React.Component {

  static propTypes = {
    slide: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    isPresenter: PropTypes.bool.isRequired
  }

  render() {
    let { slide, channel } = this.props;
    if (this.props.isPresenter) {
      return (
        <div className={styles.overlay}>
          <PresenterControls channel={channel} />
          <ConnectionsDisplay />
          <Notes notes={slide.notes} />
          <SlidePreview channel={channel} slide={slide.next} />
        </div>
      );
    } else {
      return false;
    }
  }

}
