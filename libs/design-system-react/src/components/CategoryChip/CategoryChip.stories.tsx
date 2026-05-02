import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { CategoryChip, type CategoryId } from './CategoryChip';

const ALL: [CategoryId, string][] = [
  ['restaurant','Restaurant'],['hotel','Hotel'],['park','Park'],['hospital','Hospital'],['custom','Custom'],
];

const meta: Meta<typeof CategoryChip> = {
  title: 'React/CategoryChip', component: CategoryChip, tags: ['autodocs'],
  argTypes: {
    category:    { control: 'select', options: ['restaurant','hotel','park','hospital','custom'] },
    interactive: { control: 'boolean' },
    active:      { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof CategoryChip>;

export const Default:  Story = { args: { category: 'restaurant', label: 'Restaurant' } };
export const AllStatic: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
      {ALL.map(([id, label]) => <CategoryChip key={id} category={id} label={label} />)}
    </div>
  ),
};
export const InteractiveFilter: Story = {
  render: () => {
    const [active, setActive] = useState<CategoryId | null>(null);
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, padding: 16 }}>
        {ALL.map(([id, label]) => (
          <CategoryChip key={id} category={id} label={label} interactive
            active={active === id} onClick={() => setActive(p => p === id ? null : id)}
          />
        ))}
      </div>
    );
  },
};
