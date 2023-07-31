import React from 'react';
import './stylesheets/reset.css';
import './stylesheets/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VanillaReflections from './components/VanillaReflections';
import TableOfContents from './components/TableOfContents';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TableOfContents />} />
          <Route path="/vanilla-reflections" element={<VanillaReflections />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
