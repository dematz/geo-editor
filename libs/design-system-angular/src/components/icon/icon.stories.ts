import type { Meta, StoryObj } from '@storybook/angular';
import { DsIconComponent } from './icon.component';

const meta: Meta<DsIconComponent> = {
  title: 'Angular/Icon',
  component: DsIconComponent,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    size: { control: 'number' },
  },
};
export default meta;
type Story = StoryObj<DsIconComponent>;

export const MapPin: Story = {
  args: { name: 'map-pin', size: 24 },
  render: (args) => ({
    props: args,
    template: '<ds-icon [name]="name" [size]="size"></ds-icon>',
  }),
};

export const Search: Story = {
  args: { name: 'search', size: 24 },
  render: (args) => ({
    props: args,
    template: '<ds-icon [name]="name" [size]="size"></ds-icon>',
  }),
};

export const Upload: Story = {
  args: { name: 'upload', size: 24 },
  render: (args) => ({
    props: args,
    template: '<ds-icon [name]="name" [size]="size"></ds-icon>',
  }),
};

export const Download: Story = {
  args: { name: 'download', size: 24 },
  render: (args) => ({
    props: args,
    template: '<ds-icon [name]="name" [size]="size"></ds-icon>',
  }),
};

export const Trash: Story = {
  args: { name: 'trash2', size: 24 },
  render: (args) => ({
    props: args,
    template: '<ds-icon [name]="name" [size]="size"></ds-icon>',
  }),
};

export const Plus: Story = {
  args: { name: 'plus', size: 24 },
  render: (args) => ({
    props: args,
    template: '<ds-icon [name]="name" [size]="size"></ds-icon>',
  }),
};

export const AllSizes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; align-items: center; gap: 16px; padding: 16px;">
        <div style="text-align: center;">
          <ds-icon name="map-pin" [size]="16"></ds-icon>
          <p style="font-size: 12px; margin-top: 8px;">16</p>
        </div>
        <div style="text-align: center;">
          <ds-icon name="map-pin" [size]="24"></ds-icon>
          <p style="font-size: 12px; margin-top: 8px;">24</p>
        </div>
        <div style="text-align: center;">
          <ds-icon name="map-pin" [size]="32"></ds-icon>
          <p style="font-size: 12px; margin-top: 8px;">32</p>
        </div>
        <div style="text-align: center;">
          <ds-icon name="map-pin" [size]="48"></ds-icon>
          <p style="font-size: 12px; margin-top: 8px;">48</p>
        </div>
      </div>
    `,
  }),
};

export const AllIcons: Story = {
  render: () => ({
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 16px; padding: 16px;">
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ds-icon name="map-pinned" [size]="24"></ds-icon>
          <span style="font-size: 12px;">map-pinned</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ds-icon name="search" [size]="24"></ds-icon>
          <span style="font-size: 12px;">search</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ds-icon name="upload" [size]="24"></ds-icon>
          <span style="font-size: 12px;">upload</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ds-icon name="download" [size]="24"></ds-icon>
          <span style="font-size: 12px;">download</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ds-icon name="trash2" [size]="24"></ds-icon>
          <span style="font-size: 12px;">trash2</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ds-icon name="plus" [size]="24"></ds-icon>
          <span style="font-size: 12px;">plus</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ds-icon name="pencil" [size]="24"></ds-icon>
          <span style="font-size: 12px;">pencil</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <ds-icon name="x" [size]="24"></ds-icon>
          <span style="font-size: 12px;">x</span>
        </div>
      </div>
    `,
  }),
};
