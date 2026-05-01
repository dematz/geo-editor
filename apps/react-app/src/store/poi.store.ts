import { create } from 'zustand';
import {
  createPoi, updatePoi, deletePoi, addPoi, emptyCollection,
  createPoiRepository, filterPois,
} from '@geo-editor/core';
import type { PoiFeatureCollection, LngLat, FilterOptions } from '@geo-editor/core';

const repo = createPoiRepository();

interface PoiState {
  collection:  PoiFeatureCollection;
  selectedId:  string | number | null;
  loading:     boolean;
  filter:      FilterOptions;

  // Derived (computed inline)
  filteredFeatures: () => PoiState['collection']['features'];

  // Actions
  restore:        () => Promise<void>;
  addPoint:       (coords: LngLat, name: string, category: string) => void;
  updatePoint:    (id: string | number, updates: Partial<{ name: string; category: string }>) => void;
  removePoint:    (id: string | number) => void;
  selectPoint:    (id: string | number | null) => void;
  loadCollection: (c: PoiFeatureCollection) => void;
  setFilter:      (opts: FilterOptions) => void;
  clearAll:       () => Promise<void>;
}

export const usePoiStore = create<PoiState>((set, get) => ({
  collection: emptyCollection(),
  selectedId: null,
  loading:    false,
  filter:     {},

  filteredFeatures: () => filterPois(get().collection.features, get().filter),

  restore: async () => {
    set({ loading: true });
    const saved = await repo.getAll();
    if (saved) set({ collection: saved });
    set({ loading: false });
  },

  addPoint: (coords, name, category) => {
    const poi  = createPoi(coords, name, category);
    const next = addPoi(get().collection, poi);
    set({ collection: next });
    repo.save(next).catch(console.error);
  },

  updatePoint: (id, updates) => {
    const next = updatePoi(get().collection, id, updates);
    set({ collection: next });
    repo.save(next).catch(console.error);
  },

  removePoint: (id) => {
    const next       = deletePoi(get().collection, id);
    const selectedId = get().selectedId === id ? null : get().selectedId;
    set({ collection: next, selectedId });
    repo.save(next).catch(console.error);
  },

  selectPoint: (id) => set({ selectedId: id }),

  loadCollection: (c) => {
    set({ collection: c });
    repo.save(c).catch(console.error);
  },

  setFilter: (opts) => set({ filter: opts }),

  clearAll: async () => {
    const empty = emptyCollection();
    set({ collection: empty, selectedId: null });
    await repo.clear();
  },
}));
