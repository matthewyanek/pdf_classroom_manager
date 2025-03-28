// src/contexts/ThemeContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check localStorage or use system preference as default
  const [darkMode, setDarkMode] = useState(() => {
    // Check if we're in the browser environment
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      
      // Return saved preference, or use system preference, or default to dark
      return savedTheme 
        ? savedTheme === 'dark' 
        : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // Default to dark mode
    return true;
  });

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    
    // Apply or remove the 'dark' class on the html element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);