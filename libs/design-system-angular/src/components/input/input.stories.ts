import type { Meta, StoryObj } from '@storybook/angular';
import { DsInputComponent } from './input.component';

const meta: Meta<DsInputComponent> = {
  title: 'Angular/Input',
  component: DsInputComponent,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'text' },
    placeholder: { control: 'text' },
    prefixIcon: { control: 'text' },
    error: { control: 'text' },
    id: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<DsInputComponent>;

export const Default: Story = {
  args: { placeholder: 'Enter POI name' },
  render: (args) => ({
    props: args,
    template: '<ds-input [placeholder]="placeholder" [type]="type" [prefixIcon]="prefixIcon" [error]="error" [id]="id"></ds-input>',
  }),
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Search locations...' },
  render: (args) => ({
    props: args,
    template: '<ds-input [placeholder]="placeholder" [type]="type" [prefixIcon]="prefixIcon" [error]="error" [id]="id"></ds-input>',
  }),
};

export const WithPrefixIcon: Story = {
  args: { placeholder: 'Search', prefixIcon: 'search' },
  render: (args) => ({
    props: args,
    template: '<ds-input [placeholder]="placeholder" [prefixIcon]="prefixIcon" [type]="type" [error]="error" [id]="id"></ds-input>',
  }),
};

export const WithError: Story = {
  args: { placeholder: 'Enter POI name', error: 'This field is required' },
  render: (args) => ({
    props: args,
    template: '<ds-input [placeholder]="placeholder" [error]="error" [type]="type" [prefixIcon]="prefixIcon" [id]="id"></ds-input>',
  }),
};

export const Email: Story = {
  args: { type: 'email', placeholder: 'Enter email address' },
  render: (args) => ({
    props: args,
    template: '<ds-input [type]="type" [placeholder]="placeholder" [prefixIcon]="prefixIcon" [error]="error" [id]="id"></ds-input>',
  }),
};

export const Number: Story = {
  args: { type: 'number', placeholder: 'Enter a number' },
  render: (args) => ({
    props: args,
    template: '<ds-input [type]="type" [placeholder]="placeholder" [prefixIcon]="prefixIcon" [error]="error" [id]="id"></ds-input>',
  }),
};

export const Password: Story = {
  args: { type: 'password', placeholder: 'Enter password' },
  render: (args) => ({
    props: args,
    template: '<ds-input [type]="type" [placeholder]="placeholder" [prefixIcon]="prefixIcon" [error]="error" [id]="id"></ds-input>',
  }),
};
