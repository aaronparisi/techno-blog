import React from 'react';
import { Link } from 'react-router-dom';

const TableOfContents: React.FC = () => {
  return (
    <section className="table-of-contents">
      <h1>Aaron Parisi's Techno-Blog</h1>
      <h2>Table Of Contents</h2>
      <Link to="/vanilla-reflections">Vanilla Reflections</Link>
    </section>
  );
};

export default TableOfContents;
