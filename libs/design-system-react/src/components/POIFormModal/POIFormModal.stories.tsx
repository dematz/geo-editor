import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { POIFormModal } from './POIFormModal';

const meta: Meta<typeof POIFormModal> = {
  title: 'React/POIFormModal', component: POIFormModal, tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof POIFormModal>;

export const CreateNew: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return <>
      <button onClick={() => setOpen(true)} style={{ margin: 16, padding: '8px 16px', background: 'var(--ds-primary)', color: 'var(--ds-primary-fg)', borderRadius: 'var(--ds-radius-md)', border: 'none', cursor: 'pointer' }}>Open Modal</button>
      <POIFormModal open={open} onClose={() => setOpen(false)} onSave={d => { alert(JSON.stringify(d, null, 2)); setOpen(false); }} />
    </>;
  },
};
export const EditExisting: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return <POIFormModal open={open}
      initialData={{ id:'1', name:'Le Procope', category:'restaurant', lat:'48.8534', lng:'2.3387', description:'Historic café.' }}
      onClose={() => setOpen(false)} onSave={d => { alert(JSON.stringify(d, null, 2)); setOpen(false); }} />;
  },
};
export const WithCoords: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return <POIFormModal open={open} initialData={{ lat:'48.8566', lng:'2.3522' }}
      onClose={() => setOpen(false)} onSave={d => alert(JSON.stringify(d))} />;
  },
};
