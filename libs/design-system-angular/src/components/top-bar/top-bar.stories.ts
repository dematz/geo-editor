import type { Meta, StoryObj } from '@storybook/angular';
import { DsTopBarComponent } from './top-bar.component';

const meta: Meta<DsTopBarComponent> = {
  title: 'Angular/TopBar',
  component: DsTopBarComponent,
  tags: ['autodocs'],
  argTypes: {
    search: { control: 'text' },
    canUndo: { control: 'boolean' },
    canRedo: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<DsTopBarComponent>;

export const Default: Story = {
  args: { search: '', canUndo: false, canRedo: false },
  render: (args) => ({
    props: args,
    template: '<ds-top-bar [search]="search" [canUndo]="canUndo" [canRedo]="canRedo"></ds-top-bar>',
  }),
};

export const WithSearch: Story = {
  args: { search: 'restaurant', canUndo: false, canRedo: false },
  render: (args) => ({
    props: args,
    template: '<ds-top-bar [search]="search" [canUndo]="canUndo" [canRedo]="canRedo"></ds-top-bar>',
  }),
};

export const WithHistory: Story = {
  args: { search: '', canUndo: true, canRedo: true },
  render: (args) => ({
    props: args,
    template: '<ds-top-bar [search]="search" [canUndo]="true" [canRedo]="true"></ds-top-bar>',
  }),
};

export const WithUndoOnly: Story = {
  args: { search: '', canUndo: true, canRedo: false },
  render: (args) => ({
    props: args,
    template: '<ds-top-bar [search]="search" [canUndo]="true" [canRedo]="false"></ds-top-bar>',
  }),
};

export const FullFeatures: Story = {
  args: { search: '', canUndo: true, canRedo: false },
  render: (args) => ({
    props: args,
    template: '<ds-top-bar [search]="search" [canUndo]="true" [canRedo]="false"></ds-top-bar>',
  }),
};
