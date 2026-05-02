import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import '@geo-editor/tokens';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light',  value: 'oklch(0.985 0.002 250)' },
        { name: 'dark',   value: 'oklch(0.16 0.02 258)'   },
        { name: 'topbar', value: 'oklch(0.22 0.025 258)'  },
        { name: 'white',  value: '#ffffff'                 },
      ],
    },
    docs: { toc: true },
  },
  decorators: [
    withThemeByClassName({ themes: { light: '', dark: 'dark' }, defaultTheme: 'light' }),
    Story => (
      <div style={{ fontFamily: 'var(--ds-font-sans)', fontSize: 'var(--ds-text-base)' }}>
        <Story />
      </div>
    ),
  ],
};
export default preview;
