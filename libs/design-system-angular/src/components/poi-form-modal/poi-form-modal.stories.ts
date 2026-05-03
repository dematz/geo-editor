import type { Meta, StoryObj } from '@storybook/angular';
import { DsPoiFormModalComponent } from './poi-form-modal.component';
import type { PoiFormData } from '../../utils/category-types';

const meta: Meta<DsPoiFormModalComponent> = {
  title: 'Angular/POIFormModal',
  component: DsPoiFormModalComponent,
  tags: ['autodocs'],
  argTypes: {
    open: { control: 'boolean' },
    initialData: { control: 'object' },
  },
};
export default meta;
type Story = StoryObj<DsPoiFormModalComponent>;

export const Closed: Story = {
  args: { open: false },
  render: (args) => ({
    props: args,
    template: '<ds-poi-form-modal [open]="open" [initialData]="initialData"></ds-poi-form-modal>',
  }),
};

export const NewPoi: Story = {
  args: { open: true },
  render: (args) => ({
    props: args,
    template: '<ds-poi-form-modal [open]="true" [initialData]="initialData"></ds-poi-form-modal>',
  }),
};

export const EditingPoi: Story = {
  args: {
    open: true,
    initialData: {
      id: '1',
      name: 'La Parolaccia',
      category: 'restaurant',
      lat: '40.7128',
      lng: '-74.006',
      description: 'Great Italian restaurant in the heart of Manhattan',
    } as Partial<PoiFormData>,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-form-modal [open]="true" [initialData]="initialData"></ds-poi-form-modal>',
  }),
};

export const WithPartialData: Story = {
  args: {
    open: true,
    initialData: {
      name: 'Brooklyn Museum',
      lat: '40.6501',
    } as Partial<PoiFormData>,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-form-modal [open]="true" [initialData]="initialData"></ds-poi-form-modal>',
  }),
};

export const CafeExample: Story = {
  args: {
    open: true,
    initialData: {
      name: 'Morning Coffee',
      category: 'cafe',
      lat: '40.757',
      lng: '-73.9855',
      description: 'Cozy cafe with excellent espresso',
    } as Partial<PoiFormData>,
  },
  render: (args) => ({
    props: args,
    template: '<ds-poi-form-modal [open]="true" [initialData]="initialData"></ds-poi-form-modal>',
  }),
};
