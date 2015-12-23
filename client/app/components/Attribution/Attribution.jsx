import styles from './_Attribution.scss';

import React, { PropTypes } from 'react';
import Markdown from '../../../lib/Markdown';

export default class Attribution extends React.Component {

  static propTypes = {
    content: PropTypes.string,
    position: PropTypes.string.isRequired
  }

  style = () => {
    let position = (this.props.position || 'bottom right').toLowerCase().trim();
    let style = {};
    position.split(/\s+/).forEach( (instruction) => {
      switch(instruction) {
        case 'top':
          style.top = 0;
          style.left = 0;
          style.right = 0;
          style.bottom = undefined;
          style.textAlign = 'center';
          break;
        case 'bottom':
          style.bottom = 0;
          style.left = 0;
          style.right = 0;
          style.top = undefined;
          style.textAlign = 'center';
          break;
        case 'left':
          style.left = 0;
          style.right = undefined;
          style.textAlign = 'left';
          break;
        case 'right':
          style.right = 0;
          style.left = undefined;
          style.textAlign = 'right';
          break;
        default:
      }
    });
    return style;
  }

  render() {
    if (this.props.content) {
      return (
        <div
          className={styles.attribution}
          dangerouslySetInnerHTML={
            { __html: Markdown.render(this.props.content) }
          }
          style={this.style()}
        />
      );
    } else {
      return false;
    }
  }

}
