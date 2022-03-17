import React from "react";
import Markdown from "../../Markdown";

interface SlideProps {
  content: string;
}

const Slide = ({content = ""}: SlideProps) => {

  return (
    <div className="content">
      <div
        className="markdown"
        dangerouslySetInnerHTML={{ __html: Markdown.render(content) }}
      />
    </div>
  );

}

export default Slide;
