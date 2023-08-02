import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { gruvboxLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PostProps {
  path: string;
  darkMode: boolean;
}

const Post: React.FC<PostProps> = ({ path, darkMode }) => {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    fetch(path)
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, [path]);

  return (
    <section className="blog-post">
      <Link to="/">Back to Table of Contents</Link>
      <ReactMarkdown
        children={content}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                children={String(children).replace(/\n$/, '')}
                style={darkMode ? gruvboxDark : gruvboxLight}
                language={match[1]}
                PreTag="div"
              />
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            );
          },
        }}
      />
    </section>
  );
};

export default Post;
