import type { Meta, StoryObj } from '@storybook/angular';
import { DsLabelComponent } from './label.component';

const meta: Meta<DsLabelComponent> = {
  title: 'Angular/Label',
  component: DsLabelComponent,
  tags: ['autodocs'],
  argTypes: {
    for: { control: 'text' },
    required: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<DsLabelComponent>;

export const Default: Story = {
  args: { for: 'poi-name' },
  render: (args) => ({
    props: args,
    template: '<ds-label [for]="for" [required]="required">POI Name</ds-label>',
  }),
};

export const Required: Story = {
  args: { for: 'poi-name', required: true },
  render: (args) => ({
    props: args,
    template: '<ds-label [for]="for" [required]="true">POI Name</ds-label>',
  }),
};

export const Optional: Story = {
  args: { for: 'description' },
  render: (args) => ({
    props: args,
    template: '<ds-label [for]="description" [required]="false">Description</ds-label>',
  }),
};
