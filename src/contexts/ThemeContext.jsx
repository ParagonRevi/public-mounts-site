/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { THEMES, THEME_STORAGE_KEY, getInitialTheme } from '../config/theme';

const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);
  const [isInitialized, setIsInitialized] = useState(false);

  // Применяем тему к документу
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    
    // Сохраняем выбор пользователя
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    
    // Use requestAnimationFrame to avoid setState in effect warning
    requestAnimationFrame(() => {
      setIsInitialized(true);
    });
  }, [theme]);

  // Слушаем изменения системной темы (если пользователь не выбрал явно)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      // Если нет явного выбора пользователя, следуем за системой
      if (!savedTheme || savedTheme === 'system') {
        setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT));
  }, []);

  const setLightTheme = useCallback(() => setTheme(THEMES.LIGHT), []);
  const setDarkTheme = useCallback(() => setTheme(THEMES.DARK), []);

  const value = {
    theme,
    isDark: theme === THEMES.DARK,
    isLight: theme === THEMES.LIGHT,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    isInitialized,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { THEMES };
