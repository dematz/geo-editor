import type { Meta, StoryObj } from '@storybook/angular';
import { DsTextareaComponent } from './textarea.component';

const meta: Meta<DsTextareaComponent> = {
  title: 'Angular/Textarea',
  component: DsTextareaComponent,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    error: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<DsTextareaComponent>;

export const Default: Story = {
  args: { placeholder: 'Enter description' },
  render: (args) => ({
    props: args,
    template: '<ds-textarea [placeholder]="placeholder" [rows]="rows" [error]="error"></ds-textarea>',
  }),
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Add notes about this POI...' },
  render: (args) => ({
    props: args,
    template: '<ds-textarea [placeholder]="placeholder" [rows]="rows" [error]="error"></ds-textarea>',
  }),
};

export const LargeRows: Story = {
  args: { placeholder: 'Enter description', rows: 6 },
  render: (args) => ({
    props: args,
    template: '<ds-textarea [placeholder]="placeholder" [rows]="6" [error]="error"></ds-textarea>',
  }),
};

export const WithError: Story = {
  args: { placeholder: 'Enter description', error: 'Description cannot exceed 500 characters' },
  render: (args) => ({
    props: args,
    template: '<ds-textarea [placeholder]="placeholder" [rows]="rows" [error]="error"></ds-textarea>',
  }),
};

export const SmallRows: Story = {
  args: { placeholder: 'Enter description', rows: 2 },
  render: (args) => ({
    props: args,
    template: '<ds-textarea [placeholder]="placeholder" [rows]="2" [error]="error"></ds-textarea>',
  }),
};
