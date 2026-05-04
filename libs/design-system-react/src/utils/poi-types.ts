export type CategoryId =
  | 'restaurant'
  | 'hotel'
  | 'park'
  | 'hospital'
  | 'custom';

export interface Category {
  id: CategoryId;
  label: string;
  colorVar: string;
}

export const CATEGORIES: Category[] = [
  { id: 'restaurant', label: 'Restaurant', colorVar: 'var(--ds-cat-restaurant)' },
  { id: 'hotel',      label: 'Hotel',      colorVar: 'var(--ds-cat-hotel)'      },
  { id: 'park',       label: 'Park',       colorVar: 'var(--ds-cat-park)'       },
  { id: 'hospital',   label: 'Hospital',   colorVar: 'var(--ds-cat-hospital)'   },
  { id: 'custom',     label: 'Custom',     colorVar: 'var(--ds-cat-custom)'     },
];

export const getCategoryById = (id: CategoryId): Category =>
  CATEGORIES.find(c => c.id === id) ?? CATEGORIES[4];

export interface POI {
  id: string;
  name: string;
  category: CategoryId;
  lat: number;
  lng: number;
  description?: string;
}
