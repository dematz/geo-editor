import type { Meta, StoryObj } from '@storybook/react';
import { Download, Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'React/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary','secondary','ghost','destructive','outline'] },
    size:    { control: 'select', options: ['sm','md','lg','icon'] },
    loading: { control: 'boolean' },
    disabled:{ control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary:     Story = { args: { variant: 'primary',     children: 'Save POI'       } };
export const Secondary:   Story = { args: { variant: 'secondary',   children: 'Cancel'         } };
export const Ghost:       Story = { args: { variant: 'ghost',       children: 'Learn more'     } };
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete POI'     } };
export const Outline:     Story = { args: { variant: 'outline',     children: 'Export GeoJSON' } };
export const Loading:     Story = { args: { variant: 'primary', loading: true, children: 'Saving…' } };
export const Disabled:    Story = { args: { variant: 'primary', disabled: true, children: 'Save POI' } };
export const WithIcon:    Story = { args: { variant: 'primary', children: <><Plus />New POI</> } };
export const IconOnly:    Story = { args: { variant: 'ghost', size: 'icon', children: <Trash2 />, 'aria-label': 'Delete' } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 16 }}>
      {(['primary','secondary','ghost','destructive','outline'] as const).map(v => (
        <Button key={v} variant={v}>{v}</Button>
      ))}
    </div>
  ),
};
export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
      {(['sm','md','lg'] as const).map(s => (
        <Button key={s} size={s}>{s}</Button>
      ))}
    </div>
  ),
};
export const TopbarButtons: Story = {
  render: () => (
    <div style={{ background: 'var(--ds-topbar)', padding: 16, display: 'flex', gap: 8 }}>
      <Button variant="outline" size="sm" className="variant-topbar"><Download />Export GeoJSON</Button>
    </div>
  ),
};
