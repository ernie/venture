import React from 'react';
import PropTypes from 'prop-types';

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
          className="slidePreview"
          slide={this.props.slide}
        />
      );
    } else {
      return false;
    }
  }

}