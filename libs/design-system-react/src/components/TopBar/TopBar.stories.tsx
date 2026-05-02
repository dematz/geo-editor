import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { TopBar } from './TopBar';

const meta: Meta<typeof TopBar> = {
  title: 'React/TopBar', component: TopBar, tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    return <TopBar search={search} onSearchChange={setSearch} onExport={() => alert('Export')} onImport={f => alert(f.name)} />;
  },
};
export const WithSearch: Story = {
  render: () => <TopBar search="restaurant" onSearchChange={() => {}} onExport={() => {}} onImport={() => {}} />,
};
