import React from 'react';
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

const Attribution = ({content, position}: AttributionProps) => {

  const style = () => {
    const style = {} as AttributionStyle;
    (position || 'bottom right').toLowerCase().trim().split(/\s+/).forEach( (instruction) => {
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

  if (content) {
    return (
      <div
        className="attribution"
        dangerouslySetInnerHTML={
          { __html: Markdown.render(content) }
        }
        style={style()}
      />
    );
  } else {
    return null;
  }

}

export default Attribution;
