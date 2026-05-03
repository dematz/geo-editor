import { Utensils, Coffee, Hotel, Trees, Landmark, Cross, Bus, GraduationCap, ShoppingBag, MapPin } from 'lucide-react';
import type { CategoryId } from '@geo-editor/ui-react';

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

export const CATEGORY_ICONS: Record<CategoryId, React.ElementType> = {
  restaurant: Utensils,
  cafe:       Coffee,
  hotel:      Hotel,
  park:       Trees,
  museum:     Landmark,
  hospital:   Cross,
  transport:  Bus,
  education:  GraduationCap,
  shop:       ShoppingBag,
  custom:     MapPin,
};

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
