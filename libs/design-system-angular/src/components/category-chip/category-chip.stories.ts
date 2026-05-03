import type { Meta, StoryObj } from '@storybook/angular';
import { DsCategoryChipComponent } from './category-chip.component';

const meta: Meta<DsCategoryChipComponent> = {
  title: 'Angular/CategoryChip',
  component: DsCategoryChipComponent,
  tags: ['autodocs'],
  argTypes: {
    category: { control: 'select', options: ['restaurant', 'cafe', 'museum', 'transport', 'education', 'shop'] },
    label: { control: 'text' },
    interactive: { control: 'boolean' },
    active: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<DsCategoryChipComponent>;

export const Restaurant: Story = {
  args: { category: 'restaurant', label: 'Restaurant' },
  render: (args) => ({
    props: args,
    template: '<ds-category-chip [category]="category" [label]="label" [interactive]="interactive" [active]="active"></ds-category-chip>',
  }),
};

export const Cafe: Story = {
  args: { category: 'cafe', label: 'Cafe' },
  render: (args) => ({
    props: args,
    template: '<ds-category-chip [category]="category" [label]="label" [interactive]="interactive" [active]="active"></ds-category-chip>',
  }),
};

export const Museum: Story = {
  args: { category: 'museum', label: 'Museum' },
  render: (args) => ({
    props: args,
    template: '<ds-category-chip [category]="category" [label]="label" [interactive]="interactive" [active]="active"></ds-category-chip>',
  }),
};

export const Transport: Story = {
  args: { category: 'transport', label: 'Transport' },
  render: (args) => ({
    props: args,
    template: '<ds-category-chip [category]="category" [label]="label" [interactive]="interactive" [active]="active"></ds-category-chip>',
  }),
};

export const Education: Story = {
  args: { category: 'education', label: 'Education' },
  render: (args) => ({
    props: args,
    template: '<ds-category-chip [category]="category" [label]="label" [interactive]="interactive" [active]="active"></ds-category-chip>',
  }),
};

export const Shop: Story = {
  args: { category: 'shop', label: 'Shop' },
  render: (args) => ({
    props: args,
    template: '<ds-category-chip [category]="category" [label]="label" [interactive]="interactive" [active]="active"></ds-category-chip>',
  }),
};

export const Interactive: Story = {
  args: { category: 'restaurant', label: 'Restaurant', interactive: true },
  render: (args) => ({
    props: args,
    template: '<ds-category-chip [category]="category" [label]="label" [interactive]="true" [active]="active"></ds-category-chip>',
  }),
};

export const Active: Story = {
  args: { category: 'cafe', label: 'Cafe', interactive: true, active: true },
  render: (args) => ({
    props: args,
    template: '<ds-category-chip [category]="category" [label]="label" [interactive]="true" [active]="true"></ds-category-chip>',
  }),
};

export const AllCategories: Story = {
  render: () => ({
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px; padding: 16px;">
        <ds-category-chip category="restaurant" label="Restaurant"></ds-category-chip>
        <ds-category-chip category="cafe" label="Cafe"></ds-category-chip>
        <ds-category-chip category="museum" label="Museum"></ds-category-chip>
        <ds-category-chip category="transport" label="Transport"></ds-category-chip>
        <ds-category-chip category="education" label="Education"></ds-category-chip>
        <ds-category-chip category="shop" label="Shop"></ds-category-chip>
      </div>
    `,
  }),
};
