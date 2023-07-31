import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface PostProps {
  path: string;
}

const Post: React.FC<PostProps> = ({ path }) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    fetch(path)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, [path]);

  return (
    <section className="blog-post" id="vanilla-reflections">
      <ReactMarkdown children={content} />
    </section>
  );
};

export default Post;
