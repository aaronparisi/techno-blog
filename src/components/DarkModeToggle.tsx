import React from 'react';

interface DarkModeToggleProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const DarkModeToggle: React.FC<DarkModeToggleProps> = ({
  toggleDarkMode,
  darkMode,
}) => {
  return (
    <button className="dark-mode-toggle" onClick={toggleDarkMode}>
      Turn on {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default DarkModeToggle;
