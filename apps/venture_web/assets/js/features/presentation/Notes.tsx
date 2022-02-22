import React from 'react';

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

export default Notes;
