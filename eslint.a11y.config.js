// Dedicated ESLint configuration for `npm run lint:a11y`.
// Runs ONLY the jsx-a11y plugin with the same severity policy as eslint.config.js
// so pre-existing unrelated errors (hooks, unused-vars) don't mask a11y regressions.
//
// Mirrors C:\Source\SxG.AI.FrontierAgentPlatform\ClientApp\eslint.a11y.config.js —
// keep the Fluent component map and rule set in sync.
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

const fluentComponentMap = {
  Button: 'button',
  ToggleButton: 'button',
  CompoundButton: 'button',
  MenuButton: 'button',
  SplitButton: 'button',
  Input: 'input',
  SearchBox: 'input',
  SpinButton: 'input',
  Textarea: 'textarea',
  Checkbox: 'input',
  Radio: 'input',
  Switch: 'input',
  Option: 'option',
  Slider: 'input',
  MenuItem: 'menuitem',
  MenuItemCheckbox: 'menuitemcheckbox',
  MenuItemRadio: 'menuitemradio',
  Tab: 'tab',
  TabList: 'tablist',
  Image: 'img',
  Title1: 'h1',
  Title2: 'h2',
  Title3: 'h3',
  Subtitle1: 'h4',
  Subtitle2: 'h5',
  LargeTitle: 'h1',
  Field: 'label',
  Label: 'label',
};

export default defineConfig([
  globalIgnores([
    'node_modules',
    'dist',
    'build',
    'coverage',
    '*.min.js',
    'a11y-report',
    'playwright-report',
    'test-results',
    'e2e/**',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.base,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
    ],
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      'jsx-a11y': {
        polymorphicPropName: 'as',
        components: fluentComponentMap,
      },
    },
    rules: {
      // Phase 1 — errors (these MUST stay at zero).
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/heading-has-content': 'error',
      'jsx-a11y/img-redundant-alt': 'error',
      'jsx-a11y/interactive-supports-focus': 'error',
      'jsx-a11y/media-has-caption': 'error',
      'jsx-a11y/no-interactive-element-to-noninteractive-role': 'error',
      'jsx-a11y/no-noninteractive-element-to-interactive-role': 'error',
      'jsx-a11y/no-redundant-roles': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error',
      'jsx-a11y/scope': 'error',
      'jsx-a11y/tabindex-no-positive': 'error',

      // Phase 2 — promoted to errors once backlog reached zero.
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/label-has-associated-control': [
        'error',
        {
          labelAttributes: ['label'],
          controlComponents: [
            'Input',
            'SearchBox',
            'SpinButton',
            'Slider',
            'Textarea',
            'Checkbox',
            'Radio',
            'Switch',
            'Combobox',
            'Dropdown',
            'Select',
            'RadioGroup',
          ],
        },
      ],
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/no-noninteractive-element-interactions': 'error',
      'jsx-a11y/no-noninteractive-tabindex': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',

      // Silence rules from extended configs that aren't in scope here.
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
]);
