import React from 'react';
import PropTypes from 'prop-types';

import Markdown from '../../Markdown';

export default class Notes extends React.Component {

  static propTypes = {
    notes: PropTypes.string.isRequired
  }

  static defaultProps = {
    notes: ''
  }

  render() {
    return (
      <div
        className="notes slideMarkdown"
        dangerouslySetInnerHTML={
          { __html: Markdown.render(this.props.notes) }
        }
      />
    );
  }

}
