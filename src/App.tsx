import React, { useState, useEffect } from 'react';
import './stylesheets/reset.css';
import './stylesheets/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';

import TableOfContents from './components/TableOfContents';
import VanillaMarkdown from './blogPosts/VanillaReflections.md';
import SkillsetMarkdown from './blogPosts/Skillset.md';
import Post from './components/Post';
import DarkModeToggle from './components/DarkModeToggle';

export const getInitialThemePreference = () => {
  const storedDarkMode: string | undefined = Cookies.get('ap_dark_mode');

  if (storedDarkMode !== undefined) {
    return JSON.parse(storedDarkMode);
  } else if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return true;
  } else {
    return false;
  }
};

function App() {
  // dark mode
  const [darkMode, setDarkMode] = useState<boolean>(getInitialThemePreference);
  const toggleDarkMode = () => {
    Cookies.set('ap_dark_mode', JSON.stringify(!darkMode));
    setDarkMode((prev) => !prev);
  };
  useEffect(() => {
    document.documentElement.classList.remove('dark-mode');
    if (darkMode) document.documentElement.classList.add('dark-mode');
  }, [darkMode]);
  useEffect(() => {
    const handleChange = (e: MediaQueryListEvent) => {
      if (!Cookies.get('ap_dark_mode')) setDarkMode(e.matches);
    };

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', handleChange);

    return () => {
      darkModeQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <DarkModeToggle toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
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
