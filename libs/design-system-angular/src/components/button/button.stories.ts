import type { Meta, StoryObj } from '@storybook/angular';
import { DsButtonComponent } from './button.component';

const meta: Meta<DsButtonComponent> = {
  title: 'Angular/Button',
  component: DsButtonComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'destructive', 'outline'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'icon'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<DsButtonComponent>;

export const Primary: Story = {
  args: { variant: 'primary' },
  render: (args) => ({
    props: args,
    template: '<ds-button [variant]="variant" [size]="size" [loading]="loading" [disabled]="disabled">Save POI</ds-button>',
  }),
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
  render: (args) => ({
    props: args,
    template: '<ds-button [variant]="variant" [size]="size" [loading]="loading" [disabled]="disabled">Cancel</ds-button>',
  }),
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
  render: (args) => ({
    props: args,
    template: '<ds-button [variant]="variant" [size]="size" [loading]="loading" [disabled]="disabled">Learn more</ds-button>',
  }),
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => ({
    props: args,
    template: '<ds-button [variant]="variant" [size]="size" [loading]="loading" [disabled]="disabled">Delete POI</ds-button>',
  }),
};

export const Outline: Story = {
  args: { variant: 'outline' },
  render: (args) => ({
    props: args,
    template: '<ds-button [variant]="variant" [size]="size" [loading]="loading" [disabled]="disabled">Export GeoJSON</ds-button>',
  }),
};

export const Loading: Story = {
  args: { variant: 'primary', loading: true },
  render: (args) => ({
    props: args,
    template: '<ds-button [variant]="variant" [loading]="true" [disabled]="disabled">Saving…</ds-button>',
  }),
};

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true },
  render: (args) => ({
    props: args,
    template: '<ds-button [variant]="variant" [disabled]="true" [loading]="loading">Save POI</ds-button>',
  }),
};

export const AllVariants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; padding: 16px;">
        <ds-button variant="primary">primary</ds-button>
        <ds-button variant="secondary">secondary</ds-button>
        <ds-button variant="ghost">ghost</ds-button>
        <ds-button variant="destructive">destructive</ds-button>
        <ds-button variant="outline">outline</ds-button>
      </div>
    `,
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 12px; padding: 16px;">
        <ds-button size="sm">sm</ds-button>
        <ds-button size="md">md</ds-button>
        <ds-button size="lg">lg</ds-button>
      </div>
    `,
  }),
};
