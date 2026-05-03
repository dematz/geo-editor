import type { Meta, StoryObj } from '@storybook/angular';
import { DsSidebarComponent } from './sidebar.component';
import type { SidebarPoi, SidebarCategory } from '../../utils/category-types';

const sampleCategories: SidebarCategory[] = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'cafe', label: 'Cafe' },
  { id: 'museum', label: 'Museum' },
  { id: 'transport', label: 'Transport' },
  { id: 'education', label: 'Education' },
  { id: 'shop', label: 'Shop' },
];

const samplePois: SidebarPoi[] = [
  { id: '1', name: 'La Parolaccia', category: 'restaurant', lat: 40.7128, lng: -74.006, selected: true },
  { id: '2', name: 'Brooklyn Museum', category: 'museum', lat: 40.6501, lng: -73.9746 },
  { id: '3', name: 'Central Park', category: 'park', lat: 40.7829, lng: -73.9654 },
  { id: '4', name: 'Morning Coffee', category: 'cafe', lat: 40.757, lng: -73.9855 },
  { id: '5', name: 'Penn Station', category: 'transport', lat: 40.75, lng: -73.9927 },
];

const meta: Meta<DsSidebarComponent> = {
  title: 'Angular/Sidebar',
  component: DsSidebarComponent,
  tags: ['autodocs'],
  argTypes: {
    pois: { control: 'object' },
    categories: { control: 'object' },
    collapsed: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<DsSidebarComponent>;

export const Expanded: Story = {
  args: { pois: samplePois, categories: sampleCategories, collapsed: false },
  render: (args) => ({
    props: args,
    template: '<ds-sidebar [pois]="pois" [categories]="categories" [collapsed]="collapsed"></ds-sidebar>',
  }),
  decorators: [
    (story) => ({
      template: `<div style="height: 600px; border: 1px solid #ccc;">${story.template}</div>`,
      props: story.props,
    }),
  ],
};

export const Collapsed: Story = {
  args: { pois: samplePois, categories: sampleCategories, collapsed: true },
  render: (args) => ({
    props: args,
    template: '<ds-sidebar [pois]="pois" [categories]="categories" [collapsed]="true"></ds-sidebar>',
  }),
  decorators: [
    (story) => ({
      template: `<div style="height: 600px; border: 1px solid #ccc;">${story.template}</div>`,
      props: story.props,
    }),
  ],
};

export const Empty: Story = {
  args: { pois: [], categories: sampleCategories, collapsed: false },
  render: (args) => ({
    props: args,
    template: '<ds-sidebar [pois]="pois" [categories]="categories" [collapsed]="collapsed"></ds-sidebar>',
  }),
  decorators: [
    (story) => ({
      template: `<div style="height: 600px; border: 1px solid #ccc;">${story.template}</div>`,
      props: story.props,
    }),
  ],
};

export const WithManyPois: Story = {
  args: {
    pois: [
      ...samplePois,
      { id: '6', name: 'Columbia University', category: 'education', lat: 40.8075, lng: -73.9626 },
      { id: '7', name: 'Fashion Store', category: 'shop', lat: 40.758, lng: -73.985 },
      { id: '8', name: 'Times Square', category: 'custom', lat: 40.758, lng: -73.9855 },
    ],
    categories: sampleCategories,
    collapsed: false,
  },
  render: (args) => ({
    props: args,
    template: '<ds-sidebar [pois]="pois" [categories]="categories" [collapsed]="collapsed"></ds-sidebar>',
  }),
  decorators: [
    (story) => ({
      template: `<div style="height: 600px; border: 1px solid #ccc; overflow-y: auto;">${story.template}</div>`,
      props: story.props,
    }),
  ],
};
