export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const THEME_STORAGE_KEY = 'mounts-site-theme';

/**
 * Получает системную тему пользователя
 * @returns {string} 'light' or 'dark'
 */
export const getSystemTheme = () => {
  if (typeof window === 'undefined') return THEMES.LIGHT;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEMES.DARK
    : THEMES.LIGHT;
};

/**
 * Получает сохранённую тему или системную по умолчанию
 * @returns {string} 'light' or 'dark'
 */
export const getInitialTheme = () => {
  if (typeof window === 'undefined') return THEMES.LIGHT;
  
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === THEMES.LIGHT || savedTheme === THEMES.DARK) {
    return savedTheme;
  }
  
  return getSystemTheme();
};
