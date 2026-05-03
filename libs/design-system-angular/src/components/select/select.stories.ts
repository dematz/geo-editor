import type { Meta, StoryObj } from '@storybook/angular';
import { DsSelectComponent } from './select.component';
import type { SelectOption } from '../../utils/category-types';
import { CATEGORY_COLORS } from '../../utils/category-types';

const categoryOptions: SelectOption[] = [
  { label: 'Restaurant', value: 'restaurant', colorVar: CATEGORY_COLORS.restaurant },
  { label: 'Cafe', value: 'cafe', colorVar: CATEGORY_COLORS.cafe },
  { label: 'Museum', value: 'museum', colorVar: CATEGORY_COLORS.museum },
  { label: 'Transport', value: 'transport', colorVar: CATEGORY_COLORS.transport },
  { label: 'Education', value: 'education', colorVar: CATEGORY_COLORS.education },
  { label: 'Shop', value: 'shop', colorVar: CATEGORY_COLORS.shop },
];

const meta: Meta<DsSelectComponent> = {
  title: 'Angular/Select',
  component: DsSelectComponent,
  tags: ['autodocs'],
  argTypes: {
    id: { control: 'text' },
    options: { control: 'object' },
    error: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<DsSelectComponent>;

export const Default: Story = {
  args: { options: categoryOptions },
  render: (args) => ({
    props: args,
    template: '<ds-select [options]="options" [error]="error" [id]="id"></ds-select>',
  }),
};

export const WithPreselected: Story = {
  args: { options: categoryOptions },
  render: (args) => ({
    props: { ...args, selectedValue: 'restaurant' },
    template: '<ds-select [options]="options" [error]="error" [id]="id" [(ngModel)]="selectedValue"></ds-select>',
  }),
};

export const WithError: Story = {
  args: { options: categoryOptions, error: 'Please select a category' },
  render: (args) => ({
    props: args,
    template: '<ds-select [options]="options" [error]="error" [id]="id"></ds-select>',
  }),
};

export const SimpleOptions: Story = {
  args: {
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' },
    ],
  },
  render: (args) => ({
    props: args,
    template: '<ds-select [options]="options" [error]="error" [id]="id"></ds-select>',
  }),
};
