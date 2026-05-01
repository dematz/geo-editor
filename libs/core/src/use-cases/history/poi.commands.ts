import type { Command } from './command.types';
import type { PoiFeature, PoiFeatureCollection, LngLat } from '../../domain';
import { createPoi, addPoi, deletePoi, updatePoi } from '../poi.use-cases';

export function addPoiCommand(coords: LngLat, name: string, category: string): Command {
  const poi = createPoi(coords, name, category);
  return {
    description: `Add POI "${name}"`,
    execute: (state) => addPoi(state, poi),
    undo:    (state) => deletePoi(state, poi.id!),
  };
}

export function removePoiCommand(poi: PoiFeature): Command {
  return {
    description: `Remove POI "${poi.properties.name}"`,
    execute: (state) => deletePoi(state, poi.id!),
    undo:    (state) => addPoi(state, poi),
  };
}

export function updatePoiCommand(
  id: string | number,
  prev: Partial<{ name: string; category: string }>,
  next: Partial<{ name: string; category: string }>
): Command {
  return {
    description: `Update POI "${next.name ?? id}"`,
    execute: (state) => updatePoi(state, id, next),
    undo:    (state) => updatePoi(state, id, prev),
  };
}

export function loadCollectionCommand(
  prev: PoiFeatureCollection,
  next: PoiFeatureCollection
): Command {
  return {
    description: 'Load collection',
    execute: () => next,
    undo:    () => prev,
  };
}
