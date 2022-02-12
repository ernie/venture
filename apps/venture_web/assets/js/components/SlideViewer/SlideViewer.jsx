import React from 'react';
import PropTypes from 'prop-types';

import SlideContainer from '../SlideContainer/SlideContainer';
import PresenterOverlay from '../PresenterOverlay/PresenterOverlay';

export default class SlideViewer extends React.Component {

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
