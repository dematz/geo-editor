import type { CategoryId } from '@geo-editor/ui-angular';

const RAW_TO_CAT: Record<string, CategoryId> = {
  restaurant:  'restaurant',
  cafe:        'cafe',
  hotel:       'hotel',
  park:        'park',
  landmark:    'museum',
  museum:      'museum',
  hospital:    'hospital',
  health:      'hospital',
  transport:   'transport',
  education:   'education',
  shop:        'shop',
  other:       'custom',
  custom:      'custom',
};

export function toCategoryId(raw: string): CategoryId {
  return RAW_TO_CAT[raw?.toLowerCase()] ?? 'custom';
}

export const SIDEBAR_CATEGORIES = [
  { id: 'restaurant' as CategoryId, label: 'Restaurant' },
  { id: 'cafe'       as CategoryId, label: 'Café' },
  { id: 'hotel'      as CategoryId, label: 'Hotel' },
  { id: 'park'       as CategoryId, label: 'Park' },
  { id: 'museum'     as CategoryId, label: 'Museum' },
  { id: 'hospital'   as CategoryId, label: 'Hospital' },
  { id: 'transport'  as CategoryId, label: 'Transport' },
  { id: 'education'  as CategoryId, label: 'Education' },
  { id: 'shop'       as CategoryId, label: 'Shop' },
  { id: 'custom'     as CategoryId, label: 'Custom' },
];
