import type { Meta, StoryObj } from '@storybook/angular';
import { DsPoiItemComponent } from './poi-item.component';

const meta: Meta<DsPoiItemComponent> = {
  title: 'Angular/POIItem',
  component: DsPoiItemComponent,
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    name: { control: 'text' },
    category: { control: 'select', options: ['restaurant', 'cafe', 'museum', 'transport', 'education', 'shop', 'hotel', 'park', 'hospital', 'custom'] },
    lat: { control: 'number' },
    lng: { control: 'number' },
    selected: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<DsPoiItemComponent>;

export const Default: Story = {
  args: {
    id: '1',
    name: 'La Parolaccia',
    category: 'restaurant',
    lat: 40.7128,
    lng: -74.006,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-item [id]="id" [name]="name" [category]="category" [lat]="lat" [lng]="lng" [selected]="selected"></ds-poi-item>',
  }),
};

export const Selected: Story = {
  args: {
    id: '2',
    name: 'Brooklyn Museum',
    category: 'museum',
    lat: 40.6501,
    lng: -73.9746,
    selected: true,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-item [id]="id" [name]="name" [category]="category" [lat]="lat" [lng]="lng" [selected]="true"></ds-poi-item>',
  }),
};

export const WithActions: Story = {
  args: {
    id: '3',
    name: 'Central Park',
    category: 'park',
    lat: 40.7829,
    lng: -73.9654,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-item [id]="id" [name]="name" [category]="category" [lat]="lat" [lng]="lng" [selected]="selected" edit="true" delete="true"></ds-poi-item>',
  }),
};

export const Restaurant: Story = {
  args: {
    id: '4',
    name: 'Best Burger Place',
    category: 'restaurant',
    lat: 40.7505,
    lng: -73.9972,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-item [id]="id" [name]="name" [category]="category" [lat]="lat" [lng]="lng" [selected]="selected"></ds-poi-item>',
  }),
};

export const Cafe: Story = {
  args: {
    id: '5',
    name: 'Morning Coffee',
    category: 'cafe',
    lat: 40.757,
    lng: -73.9855,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-item [id]="id" [name]="name" [category]="category" [lat]="lat" [lng]="lng" [selected]="selected"></ds-poi-item>',
  }),
};

export const Transport: Story = {
  args: {
    id: '6',
    name: 'Penn Station',
    category: 'transport',
    lat: 40.75,
    lng: -73.9927,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-item [id]="id" [name]="name" [category]="category" [lat]="lat" [lng]="lng" [selected]="selected"></ds-poi-item>',
  }),
};

export const Education: Story = {
  args: {
    id: '7',
    name: 'Columbia University',
    category: 'education',
    lat: 40.8075,
    lng: -73.9626,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-item [id]="id" [name]="name" [category]="category" [lat]="lat" [lng]="lng" [selected]="selected"></ds-poi-item>',
  }),
};

export const Shop: Story = {
  args: {
    id: '8',
    name: 'Fashion Store',
    category: 'shop',
    lat: 40.758,
    lng: -73.985,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-item [id]="id" [name]="name" [category]="category" [lat]="lat" [lng]="lng" [selected]="selected"></ds-poi-item>',
  }),
};
