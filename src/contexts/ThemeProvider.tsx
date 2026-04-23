import React, { useCallback, useEffect, useState } from 'react';
import { FluentProvider } from '@fluentui/react-components';
import { ThemeContext } from './ThemeContext';
import type { ThemeName } from './ThemeContext';
import { getFluentTheme } from '../utils/fluentThemes';
import { useTabsterA11yFix } from '../hooks/useTabsterA11yFix';

const STORAGE_KEY = 'sxg-hub-theme';

/**
 * Frontier-parity theme provider. Wraps the app in <FluentProvider> so every
 * Fluent component receives the token palette + direction + focus outline config.
 *
 * Also installs the tabster a11y fix (required for axe compliance on routes
 * that render Fluent components; see useTabsterA11yFix.ts).
 *
 * Ported from SxG.AI.FrontierAgentPlatform ClientApp/src/contexts/ThemeProvider.tsx —
 * simplified to 3 themes for the Hub's initial migration.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === 'light' || saved === 'dark' || saved === 'highcontrast') return saved;
    return 'light';
  });

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // ignore quota / private-mode failures
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fluentTheme = getFluentTheme(theme);

  useTabsterA11yFix();

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fluentTheme }}>
      <FluentProvider theme={fluentTheme}>{children}</FluentProvider>
    </ThemeContext.Provider>
  );
};
