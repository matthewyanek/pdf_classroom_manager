// src/components/ThemeToggle.tsx
import React from 'react';

const ThemeToggle: React.FC = () => {
  // Simple toggle button without context for now
  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 p-2 rounded-md flex items-center justify-center transition-colors duration-200"
      aria-label="Toggle theme"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    </button>
  );
};

export default ThemeToggle;