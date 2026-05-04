import { create } from 'zustand';
import {
  emptyCollection, createPoiRepository, filterPois,
  initHistory, applyCommand, undoHistory, redoHistory, canUndo, canRedo,
  addPoiCommand, removePoiCommand, updatePoiCommand, loadCollectionCommand,
} from '@geo-editor/core';
import type { PoiFeatureCollection, LngLat, FilterOptions, HistoryState } from '@geo-editor/core';

const repo = createPoiRepository();

interface PoiState {
  history:    HistoryState;
  selectedId: string | number | null;
  loading:    boolean;
  filter:     FilterOptions;

  collection:       () => PoiFeatureCollection;
  features:         () => PoiFeatureCollection['features'];
  filteredFeatures: () => PoiFeatureCollection['features'];
  canUndo:          () => boolean;
  canRedo:          () => boolean;

  restore:        () => Promise<void>;
  addPoint:       (coords: LngLat, name: string, category: string, description?: string) => void;
  updatePoint:    (id: string | number, updates: Partial<{ name: string; category: string; description: string }>) => void;
  removePoint:    (id: string | number) => void;
  selectPoint:    (id: string | number | null) => void;
  loadCollection: (c: PoiFeatureCollection) => void;
  setFilter:      (opts: FilterOptions) => void;
  clearAll:       () => Promise<void>;
  undo:           () => void;
  redo:           () => void;
}

export const usePoiStore = create<PoiState>((set, get) => ({
  history:    initHistory(emptyCollection()),
  selectedId: null,
  loading:    false,
  filter:     {},

  collection:       () => get().history.present,
  features:         () => get().history.present.features,
  filteredFeatures: () => filterPois(get().history.present.features, get().filter),
  canUndo:          () => canUndo(get().history),
  canRedo:          () => canRedo(get().history),

  restore: async () => {
    set({ loading: true });
    const saved = await repo.getAll();
    if (saved) set({ history: initHistory(saved) });
    set({ loading: false });
  },

  addPoint: (coords, name, category, description) => {
    const next = applyCommand(get().history, addPoiCommand(coords, name, category, description));
    set({ history: next });
    repo.save(next.present).catch(console.error);
  },

  updatePoint: (id, updates) => {
    const poi = get().features().find((f) => f.id === id);
    if (!poi) return;
    const prev = {
      name:        poi.properties.name,
      category:    poi.properties.category,
      description: poi.properties.description ?? '',
    };
    const next = applyCommand(get().history, updatePoiCommand(id, prev, updates));
    set({ history: next });
    repo.save(next.present).catch(console.error);
  },

  removePoint: (id) => {
    const poi = get().features().find((f) => f.id === id);
    if (!poi) return;
    const next = applyCommand(get().history, removePoiCommand(poi));
    set({ history: next, selectedId: get().selectedId === id ? null : get().selectedId });
    repo.save(next.present).catch(console.error);
  },

  selectPoint: (id) => set({ selectedId: id }),

  loadCollection: (c) => {
    const next = applyCommand(get().history, loadCollectionCommand(get().collection(), c));
    set({ history: next });
    repo.save(next.present).catch(console.error);
  },

  setFilter: (opts) => set({ filter: opts }),

  clearAll: async () => {
    set({ history: initHistory(emptyCollection()), selectedId: null });
    await repo.clear();
  },

  undo: () => {
    const next = undoHistory(get().history);
    set({ history: next });
    repo.save(next.present).catch(console.error);
  },

  redo: () => {
    const next = redoHistory(get().history);
    set({ history: next });
    repo.save(next.present).catch(console.error);
  },
}));
