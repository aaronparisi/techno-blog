import React from 'react';
import { Link } from 'react-router-dom';
import { PostInfo } from '../App';

interface TableOfContentsProps {
  pages: PostInfo[];
}
const TableOfContents: React.FC<TableOfContentsProps> = ({ pages }) => {
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
