import React from "react";
import Markdown from "../../Markdown";

interface SlideProps {
  content: string;
}

const Slide = ({content = ""}: SlideProps) => {

  return (
    <div
      className="content markdown slideMarkdown"
      dangerouslySetInnerHTML={{ __html: Markdown.render(content) }}
    />
  );

}

export default Slide;
