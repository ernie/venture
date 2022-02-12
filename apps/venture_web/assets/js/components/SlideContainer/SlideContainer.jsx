import React from 'react';
import PropTypes from 'prop-types';

import Filter from '../Filter/Filter';
import Canvas from '../Canvas/Canvas';

import classNames from 'classnames';

export default class SlideContainer extends React.Component {

  static propTypes = {
    slide: PropTypes.object.isRequired,
    channel: PropTypes.object.isRequired,
    className: PropTypes.string,
    active: PropTypes.bool
  }

  static defaultProps = {
    className: '',
    active: true
  }

  backgroundStyle(object) {
    let bgStyles = {}
    if (object.image) {
      bgStyles.backgroundImage =
        `url("/backgrounds/${object.image}")`;
    }
    if (object.size) {
      bgStyles.backgroundSize = object.size;
    }
    if (object.repeat) {
      bgStyles.backgroundRepeat = object.repeat;
    }
    if (object.position) {
      bgStyles.backgroundPosition = object.position;
    }
    if (object.color) {
      bgStyles.backgroundColor = object.color;
    }
    return bgStyles;
  }

  slideStyle = () => {
    let slide = this.props.slide;
    let slideStyle = {};
    if (typeof slide.background === 'string') {
      if (slide.background.startsWith('#')) {
        slideStyle.color = slide.background;
      } else {
        slideStyle.image = slide.background;
      }
    } else if (typeof slide.background === 'object') {
      Object.assign(slideStyle, slide.background);
    }
    return Object.assign({}, this.backgroundStyle(slideStyle));
  }

  render() {
    let { slide, channel, className, active } = this.props;
    let slideStyle = this.slideStyle();
    let baseClasses = slide.type !== 'slide' ? [`${slide.type}-slide`] : [];
    let slideClasses = baseClasses.concat(slide.class || []);
    return (
      <div className={classNames(className, 'slide-container')}>
        <div
          className={classNames('slide', ...slideClasses)}
          style={slideStyle}
        >
          <Filter slide={slide} />
          <Canvas
            active={active}
            channel={channel}
            slide={slide}
          />
        </div>
      </div>
    );
  }

}
