import type { Meta, StoryObj } from '@storybook/react';
import { Search } from 'lucide-react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'React/Input', component: Input, tags: ['autodocs'],
  argTypes: { placeholder: { control: 'text' }, disabled: { control: 'boolean' }, error: { control: 'text' } },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Default:    Story = { args: { placeholder: 'e.g. Café de Flore' } };
export const WithIcon:   Story = { args: { placeholder: 'Search POIs…', prefixIcon: <Search /> } };
export const WithError:  Story = { args: { id: 'name', placeholder: 'POI name', error: 'Name is required' } };
export const Disabled:   Story = { args: { placeholder: 'Disabled', disabled: true } };
export const Coords:     Story = { args: { value: '48.8534', className: 'tabular-nums', readOnly: true } };
