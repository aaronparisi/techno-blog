import React, { useState, useEffect } from 'react';
import './stylesheets/reset.css';
import './stylesheets/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';

import TableOfContents from './components/TableOfContents';
import VanillaMarkdown from './blogPosts/VanillaReflections.md';
import SkillsetMarkdown from './blogPosts/Skillset.md';
import JSValueReferenceMarkdown from './blogPosts/JSValueReference.md';
import AsyncForEachMarkdown from './blogPosts/AsyncForEach.md';
import StringPortMarkdown from './blogPosts/StringPort.md';
import GitHubIssueTrackerMarkdown from './blogPosts/GitHubIssueTracker.md';
import ReactExplorationsMarkdown from './blogPosts/ReactExplorations.md';

import Post from './components/Post';
import DarkModeToggle from './components/DarkModeToggle';

export const getInitialThemePreference = () => {
  const storedDarkMode: string | undefined = Cookies.get('ap_blog_dark_mode');

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

export interface PostInfo {
  path: string;
  content: string;
  markdown: string;
}
const pages: PostInfo[] = [
  {
    path: '/skillset',
    content:
      'The Skillset: my evolving understanding of what writing software entails - April 2023',
    markdown: SkillsetMarkdown,
  },
  {
    path: '/js-value-reference',
    content:
      'Is JavaScript Pass-by-Value or Pass-by-Reference: this and other age-old questions - April 2023',
    markdown: JSValueReferenceMarkdown,
  },
  {
    path: '/async-for-each',
    content: 'async-a-what? : a ChatGPT learning session - May 2023',
    markdown: AsyncForEachMarkdown,
  },
  {
    path: '/string-port',
    content: 'What happens if you pass a string to server.listen()? - May 2023',
    markdown: StringPortMarkdown,
  },
  {
    path: '/vanilla-reflections',
    content:
      'Vanilla with no Sprinkles: a meandering reflection on a year without React - July 2023',
    markdown: VanillaMarkdown,
  },
  {
    path: '/gh-issue-tracker',
    content: 'GitHub Issue Tracker Project: Lessons Learned - August 2023',
    markdown: GitHubIssueTrackerMarkdown,
  },
  {
    path: '/react-explorations',
    content: 'React Explorations: a ChatGPT learning session - September 2023',
    markdown: ReactExplorationsMarkdown,
  },
];

function App() {
  // dark mode
  const [darkMode, setDarkMode] = useState<boolean>(getInitialThemePreference);
  const toggleDarkMode = () => {
    Cookies.set('ap_blog_dark_mode', JSON.stringify(!darkMode));
    setDarkMode((prev) => !prev);
  };
  useEffect(() => {
    document.documentElement.classList.remove('dark-mode');
    if (darkMode) document.documentElement.classList.add('dark-mode');
  }, [darkMode]);
  useEffect(() => {
    const handleChange = (e: MediaQueryListEvent) => {
      if (!Cookies.get('ap_blog_dark_mode')) setDarkMode(e.matches);
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
          {pages.map(({ path, markdown }) => {
            return (
              <Route
                key={path}
                path={path}
                element={<Post path={markdown} darkMode={darkMode} />}
              />
            );
          })}
          <Route path="/" element={<TableOfContents pages={pages} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
