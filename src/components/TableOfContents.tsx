import React from 'react';
import { Link } from 'react-router-dom';

interface PostInfo {
  path: string;
  content: string;
}
const pages: PostInfo[] = [
  {
    path: '/skillset',
    content:
      'The Skillset: reflections on my evolving understanding of what writing software entials - April 2023',
  },
  {
    path: '/vanilla-reflections',
    content:
      'Vanilla with no Sprinkles: a meandering reflection on a year without React - July 2023',
  },
];
const TableOfContents: React.FC = () => {
  return (
    <section className="table-of-contents">
      <h1>Aaron Parisi's Techno-Blog</h1>
      <h2>Table Of Contents</h2>

      <ul>
        {pages.map(({ path, content }, idx) => {
          return (
            <li key={content}>
              <Link to={path}>{content}</Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default TableOfContents;
