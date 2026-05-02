import type { PoiFeature, PoiFeatureCollection, LngLat } from '../domain';

export function createPoi(
  coords: LngLat,
  name: string,
  category: string,
  extraProps?: Record<string, string | number | boolean | null>
): PoiFeature {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [coords.lng, coords.lat] },
    properties: { name: name.trim(), category: category.trim(), ...extraProps },
    id: `poi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
}

export function updatePoi(
  collection: PoiFeatureCollection,
  id: string | number,
  updates: Partial<{ name: string; category: string; description: string }>
): PoiFeatureCollection {
  return {
    ...collection,
    features: collection.features.map((f) =>
      f.id === id
        ? { ...f, properties: { ...f.properties, ...updates } }
        : f
    ),
  };
}

export function deletePoi(
  collection: PoiFeatureCollection,
  id: string | number
): PoiFeatureCollection {
  return {
    ...collection,
    features: collection.features.filter((f) => f.id !== id),
  };
}

export function addPoi(
  collection: PoiFeatureCollection,
  poi: PoiFeature
): PoiFeatureCollection {
  return { ...collection, features: [...collection.features, poi] };
}

export function emptyCollection(): PoiFeatureCollection {
  return { type: 'FeatureCollection', features: [] };
}
