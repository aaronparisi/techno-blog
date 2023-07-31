import React from 'react';
import './stylesheets/reset.css';
import './stylesheets/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import TableOfContents from './components/TableOfContents';
import VanillaMarkdown from './blogPosts/VanillaReflections.md';
import SkillsetMarkdown from './blogPosts/Skillset.md';
import Post from './components/Post';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TableOfContents />} />
          <Route
            path="/vanilla-reflections"
            element={<Post path={VanillaMarkdown} />}
          />
          <Route path="/skillset" element={<Post path={SkillsetMarkdown} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
