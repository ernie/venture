import styles from './_Filter.scss';

import React, { PropTypes } from 'react';

export default class Filter extends React.Component {

  static propTypes = {
    slide: PropTypes.object.isRequired
  }

  style = () => {
    let style = {};
    let bg = this.props.slide.background || {};
    if (typeof bg === 'object') {
      if (bg.darken) {
        style.backgroundColor = '#000';
        style.opacity = bg.darken;
      } else if (bg.lighten) {
        style.backgroundColor = '#fff';
        style.opacity = bg.lighten;
      }
    }
    return style;
  }

  render() {
    return (
      <div
        className={'filter'}
        style={this.style()}
      />
    );
  }

}
