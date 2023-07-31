import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import VanillaMarkdown from '../blogPosts/VanillaReflections.md';

const VanillaReflections: React.FC = () => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    fetch(VanillaMarkdown)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <section className="blog-post" id="vanilla-reflections">
      <ReactMarkdown children={content} />
    </section>
  );
};

export default VanillaReflections;
