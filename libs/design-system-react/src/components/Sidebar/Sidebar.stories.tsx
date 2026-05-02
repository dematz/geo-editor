import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Utensils, Hotel, Trees, Cross, MapPin } from 'lucide-react';
import { Sidebar } from './Sidebar';

const POIS = [
  { id:'1', name:'Le Procope',           category:'restaurant' as const, icon: Utensils, lat:48.8534, lng:2.3387 },
  { id:'2', name:'Hôtel de Crillon',     category:'hotel'      as const, icon: Hotel,    lat:48.8676, lng:2.3214 },
  { id:'3', name:'Jardin du Luxembourg', category:'park'        as const, icon: Trees,    lat:48.8462, lng:2.3372 },
  { id:'4', name:'Hôpital Saint-Louis',  category:'hospital'   as const, icon: Cross,    lat:48.8722, lng:2.3683 },
];
const CATS = [
  { id:'restaurant' as const, label:'Restaurant' },{ id:'hotel' as const, label:'Hotel' },
  { id:'park' as const, label:'Park' },{ id:'hospital' as const, label:'Hospital' },
  { id:'custom' as const, label:'Custom' },
];

const meta: Meta<typeof Sidebar> = {
  title: 'React/Sidebar', component: Sidebar, tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [Story => <div style={{ display:'flex', height:'100vh' }}><Story /></div>],
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const WithPOIs: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return <Sidebar pois={POIS} categories={CATS} collapsed={collapsed}
      onToggle={() => setCollapsed(c => !c)} onNew={() => alert('New')}
      onEdit={id => alert(`Edit ${id}`)} onDelete={id => alert(`Delete ${id}`)} onFocus={id => alert(`Focus ${id}`)} />;
  },
};
export const Empty: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    return <Sidebar pois={[]} categories={CATS} collapsed={collapsed}
      onToggle={() => setCollapsed(c => !c)} onNew={() => {}} onEdit={() => {}} onDelete={() => {}} onFocus={() => {}} />;
  },
};
export const Collapsed: Story = {
  render: () => {
    const [collapsed, setCollapsed] = useState(true);
    return <Sidebar pois={POIS} categories={CATS} collapsed={collapsed}
      onToggle={() => setCollapsed(c => !c)} onNew={() => {}} onEdit={() => {}} onDelete={() => {}} onFocus={() => {}} />;
  },
};
