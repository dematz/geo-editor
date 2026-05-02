import type { Meta, StoryObj } from '@storybook/react';
import { Utensils, Hotel, Trees, Cross, MapPin } from 'lucide-react';
import { POIItem } from './POIItem';

const meta: Meta<typeof POIItem> = {
  title: 'React/POIItem', component: POIItem, tags: ['autodocs'],
  decorators: [Story => (
    <div style={{ width: 280, background: 'var(--ds-surface)', padding: 8, borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-border)' }}>
      <Story />
    </div>
  )],
};
export default meta;
type Story = StoryObj<typeof POIItem>;

const POIS = [
  { id:'1', name:'Le Procope',           category:'restaurant' as const, icon: Utensils, lat:48.8534, lng:2.3387 },
  { id:'2', name:'Hôtel de Crillon',     category:'hotel'      as const, icon: Hotel,    lat:48.8676, lng:2.3214 },
  { id:'3', name:'Jardin du Luxembourg', category:'park'        as const, icon: Trees,    lat:48.8462, lng:2.3372 },
  { id:'4', name:'Hôpital Saint-Louis',  category:'hospital'   as const, icon: Cross,    lat:48.8722, lng:2.3683 },
  { id:'5', name:'Custom Point',         category:'custom'     as const, icon: MapPin,   lat:48.86,   lng:2.35   },
];

export const Restaurant: Story = { args: { ...POIS[0], onEdit: id => alert(`edit ${id}`), onDelete: id => alert(`delete ${id}`) } };
export const AllCategories: Story = {
  render: () => (
    <div style={{ width: 280, background: 'var(--ds-surface)', borderRadius: 'var(--ds-radius-lg)', border: '1px solid var(--ds-border)', overflow: 'hidden' }}>
      {POIS.map(p => <POIItem key={p.id} {...p} onEdit={id => alert(`edit ${id}`)} onDelete={id => alert(`delete ${id}`)} />)}
    </div>
  ),
};
export const EmptyState: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <div style={{ padding: '2rem 1rem', textAlign: 'center', fontSize: 'var(--ds-text-xs)', color: 'var(--ds-muted-fg)', lineHeight: 'var(--ds-leading-relaxed)' }}>
        No points yet.<br />Click the map or "New POI".
      </div>
    </div>
  ),
};
