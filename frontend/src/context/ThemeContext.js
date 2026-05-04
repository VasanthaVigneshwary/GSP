import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Priority 1: User manual override saved in localStorage
    const savedTheme = localStorage.getItem('gsp-theme');
    if (savedTheme) return savedTheme;

    // Priority 2: Environment variable configuration
    const envTheme = process.env.REACT_APP_THEME;
    if (envTheme && (envTheme === 'dark' || envTheme === 'light')) {
      return envTheme;
    }

    // Priority 3: System preference default
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    // Update the data-theme attribute on document root
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gsp-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
