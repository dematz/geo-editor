import type { CategoryId } from '@geo-editor/ui-angular';

const RAW_TO_CAT: Record<string, CategoryId> = {
  restaurant: 'restaurant',
  cafe: 'restaurant',
  hotel: 'hotel',
  park: 'park',
  landmark: 'park',
  museum: 'park',
  hospital: 'hospital',
  health: 'hospital',
  shop: 'custom',
  transport: 'custom',
  education: 'custom',
  other: 'custom',
  custom: 'custom',
};

export function toCategoryId(raw: string): CategoryId {
  return RAW_TO_CAT[raw?.toLowerCase()] ?? 'custom';
}

export const SIDEBAR_CATEGORIES = [
  { id: 'restaurant' as CategoryId, label: 'Restaurant' },
  { id: 'hotel' as CategoryId, label: 'Hotel' },
  { id: 'park' as CategoryId, label: 'Park' },
  { id: 'hospital' as CategoryId, label: 'Hospital' },
  { id: 'custom' as CategoryId, label: 'Custom' },
];
