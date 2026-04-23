/**
 * Fluent UI v9 theme configuration.
 *
 * Simplified from SxG.AI.FrontierAgentPlatform ClientApp/src/utils/fluentThemes.ts:
 * the Hub currently only needs light + dark + highcontrast. Additional brand
 * ramps can be ported later when we need the full Frontier theme picker.
 */
import {
  createLightTheme,
  createDarkTheme,
  teamsHighContrastTheme,
  type BrandVariants,
  type Theme,
} from '@fluentui/react-components';
import type { ThemeName } from '../contexts/ThemeContext';

const lightBrand: BrandVariants = {
  10: '#020d17',
  20: '#0a1d30',
  30: '#0e2c48',
  40: '#103a5e',
  50: '#124874',
  60: '#14578b',
  70: '#0d60aa',
  80: '#0d60aa',
  90: '#5c96c9',
  100: '#76a8d3',
  110: '#8fbbdd',
  120: '#a8cde7',
  130: '#c1dff0',
  140: '#daeef8',
  150: '#ecf6fc',
  160: '#f7fbfe',
};

const darkBrand: BrandVariants = {
  10: '#050d17',
  20: '#0e1d33',
  30: '#152d4f',
  40: '#1c3d6b',
  50: '#234e88',
  60: '#2b5fa5',
  70: '#4a78b8',
  80: '#89b4fa',
  90: '#97bffb',
  100: '#a5cafc',
  110: '#b3d5fd',
  120: '#c1dffd',
  130: '#d0eafe',
  140: '#dff0fe',
  150: '#edf7ff',
  160: '#f7fbff',
};

const lightTheme: Theme = {
  ...createLightTheme(lightBrand),
  colorNeutralBackground1: '#ffffff',
  colorNeutralBackground2: '#fafbfd',
  colorNeutralForeground1: '#1a1a2e',
  colorNeutralForeground2: '#5f6672',
  colorNeutralForeground3: '#6b6f77',
  colorNeutralStroke1: '#e5e7eb',
  colorNeutralStroke2: '#f0f0f0',
  colorPaletteGreenForeground1: '#0f7534',
  colorPaletteYellowForeground1: '#9d5500',
  colorPaletteRedForeground1: '#c62222',
  colorPaletteBlueForeground2: '#3b82f6',
};

const darkTheme: Theme = {
  ...createDarkTheme(darkBrand),
  colorNeutralBackground1: '#1e1e2e',
  colorNeutralBackground2: '#1a1a28',
  colorNeutralForeground1: '#cdd6f4',
  colorNeutralForeground2: '#a6adc8',
  colorNeutralForeground3: '#8b8fa6',
  colorNeutralStroke1: '#45475a',
  colorNeutralStroke2: '#313244',
  colorPaletteGreenForeground1: '#a6e3a1',
  colorPaletteYellowForeground1: '#f9e2af',
  colorPaletteRedForeground1: '#f38ba8',
  colorPaletteBlueForeground2: '#89dceb',
};

export const fluentThemeMap: Record<ThemeName, Theme> = {
  light: lightTheme,
  dark: darkTheme,
  highcontrast: teamsHighContrastTheme,
};

export function getFluentTheme(name: ThemeName): Theme {
  return fluentThemeMap[name];
}
