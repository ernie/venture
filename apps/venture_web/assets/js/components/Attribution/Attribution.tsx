import React from 'react';
import PropTypes from 'prop-types';
import Markdown from '../../Markdown';

interface AttributionProps {
  content: string;
  position: string;
}

interface AttributionStyle {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  textAlign?: "left" | "center" | "right";
}

export default class Attribution extends React.Component<AttributionProps> {

  static propTypes = {
    content: PropTypes.string,
    position: PropTypes.string.isRequired
  }

  style = () => {
    let position = (this.props.position || 'bottom right').toLowerCase().trim();
    let style = {} as AttributionStyle;
    position.split(/\s+/).forEach( (instruction) => {
      switch(instruction) {
        case 'top':
          style.top = 0;
          style.left = 0;
          style.right = 0;
          style.textAlign = 'center';
          break;
        case 'bottom':
          style.bottom = 0;
          style.left = 0;
          style.right = 0;
          style.textAlign = 'center';
          break;
        case 'left':
          style.left = 0;
          style.textAlign = 'left';
          break;
        case 'right':
          style.right = 0;
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
          className="attribution"
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
