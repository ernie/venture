import React from 'react';
import PropTypes from 'prop-types';

import Markdown from '../../Markdown';

interface NotesProps {
  notes: string;
}

const Notes = ({ notes = "" }: NotesProps) => {

  return (
    <div
      className="notes slideMarkdown"
      dangerouslySetInnerHTML={
        { __html: Markdown.render(notes) }
      }
    />
  );

}

Notes.propTypes = {
  notes: PropTypes.string.isRequired
}

export default Notes;
