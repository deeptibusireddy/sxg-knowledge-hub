import { createContext } from 'react';
import type { Theme } from '@fluentui/react-components';

export type ThemeName = 'light' | 'dark' | 'highcontrast';

export interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  fluentTheme: Theme;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
