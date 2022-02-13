import React from 'react';
import PropTypes from 'prop-types';

import SlideContainer from '../SlideContainer/SlideContainer';
import PresenterOverlay from '../PresenterOverlay/PresenterOverlay';

type SlideViewerProps = {
  slide: Object;
  isPresenter: boolean;
  channel: Object;
}

export default class SlideViewer extends React.Component<SlideViewerProps> {

  static propTypes = {
    slide: PropTypes.object.isRequired,
    isPresenter: PropTypes.bool.isRequired,
    channel: PropTypes.object.isRequired
  }

  render() {
    let { isPresenter, slide, channel } = this.props;
    let className = isPresenter ? "presenter" : "attendee";
    return (
      <div className="viewer">
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
