export type CategoryId =
  | 'restaurant'
  | 'cafe'
  | 'hotel'
  | 'park'
  | 'museum'
  | 'hospital'
  | 'transport'
  | 'education'
  | 'shop'
  | 'custom';

export interface SelectOption {
  value: string;
  label: string;
  colorVar?: string;
}

export const CATEGORY_COLORS: Record<CategoryId, string> = {
  restaurant: 'var(--ds-cat-restaurant)',
  cafe:       'var(--ds-cat-restaurant)',  // reutiliza naranja
  hotel:      'var(--ds-cat-hotel)',
  park:       'var(--ds-cat-park)',
  museum:     'var(--ds-cat-park)',        // reutiliza verde
  hospital:   'var(--ds-cat-hospital)',
  transport:  'var(--ds-cat-hotel)',       // reutiliza índigo
  education:  'var(--ds-cat-custom)',      // reutiliza slate
  shop:       'var(--ds-cat-custom)',      // reutiliza slate
  custom:     'var(--ds-cat-custom)',
};

export interface SidebarPoi {
  id:        string;
  name:      string;
  category:  CategoryId;
  lat:       number;
  lng:       number;
  icon?:     string;
  selected?: boolean;
}

export interface SidebarCategory {
  id:    CategoryId;
  label: string;
}

export interface PoiFormData {
  id?:         string;
  name:        string;
  category:    CategoryId;
  lat:         string;
  lng:         string;
  description: string;
}

export type IconName =
  | 'map-pinned'
  | 'search'
  | 'upload'
  | 'download'
  | 'undo2'
  | 'redo2'
  | 'trash2'
  | 'plus'
  | 'chevron-left'
  | 'chevron-right'
  | 'pencil'
  | 'x'
  | 'chevron-down'
  | 'utensils'
  | 'hotel'
  | 'trees'
  | 'cross'
  | 'map-pin'
  | 'coffee'
  | 'landmark'
  | 'bus'
  | 'graduation-cap'
  | 'shopping-bag';
