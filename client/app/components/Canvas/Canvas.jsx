import styles from './_Canvas.scss';

import React, { PropTypes } from 'react';

import EmptySlide from '../EmptySlide/EmptySlide';
import Slide from '../Slide/Slide';
import ForkSlide from '../ForkSlide/ForkSlide';
import PollSlide from '../PollSlide/PollSlide';
import ChatSlide from '../ChatSlide/ChatSlide';
import TitleSlide from '../TitleSlide/TitleSlide';
import Attribution from '../Attribution/Attribution';

export default class Canvas extends React.Component {

  static propTypes = {
    active: PropTypes.bool.isRequired,
    channel: PropTypes.object.isRequired,
    slide: PropTypes.object.isRequired
  }

  attribution = () => {
    let slide = this.props.slide;
    let attribution = {position: 'bottom right'};
    if (typeof slide.attribution === 'string') {
      attribution.content = slide.attribution;
    } else if (typeof slide.attribution === 'object') {
      Object.assign(attribution, slide.attribution);
    }
    return attribution;
  }

  style = () => {
    let align = (this.props.slide.align || '').toLowerCase().trim();
    let style = {};
    align.split(/\s+/).forEach( (instruction) => {
      switch(instruction) {
        case 'center':
          style.alignItems = 'center';
          style.justifyContent = 'center';
          style.textAlign = 'center';
          break;
        case 'top':
          style.alignItems = 'flex-start';
          break;
        case 'bottom':
          style.alignItems = 'flex-end';
          break;
        case 'left':
          style.justifyContent = 'flex-start';
          style.textAlign = 'left';
          break;
        case 'right':
          style.justifyContent = 'flex-end';
          style.textAlign = 'right';
          break;
        default:
      }
    });
    return style;
  }

  renderSlide() {
    let { slide, channel, active } = this.props;
    switch (slide.type) {
      case 'empty':
        return (<EmptySlide />);
        break;
      case 'slide':
        return (
          <Slide
            active={active}
            content={slide.content}
          />
        );
        break;
      case 'title':
        return (
          <TitleSlide
            active={active}
            content={slide.content}
          />
        );
        break;
      case 'fork':
        return (
          <ForkSlide
            active={active}
            channel={channel}
            content={slide.content}
            paths={slide.paths}
          />
        );
        break;
      case 'poll':
        return (
          <PollSlide
            active={active}
            channel={channel}
            content={slide.content}
            options={slide.options}
          />
        );
        break;
      case 'chat':
        return (
          <ChatSlide
            active={active}
            content={slide.content}
          />
        );
        break;
      default:
        return (<div>Unknown slide type: {slide.type}</div>);
    }
  }

  render() {
    let attribution = this.attribution();

    return (
      <div
        className={'canvas'}
        style={this.style()}
      >
        {this.renderSlide()}
        <Attribution
          content={attribution.content}
          position={attribution.position}
        />
      </div>
    );
  }

}
