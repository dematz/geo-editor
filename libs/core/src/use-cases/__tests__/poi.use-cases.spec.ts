import { describe, it, expect } from 'vitest';
import {
  createPoi, updatePoi, deletePoi, addPoi, emptyCollection,
} from '../poi.use-cases';
import type { PoiFeatureCollection } from '../../domain';

const coords = { lng: -74.07, lat: 4.71 };

const baseCollection = (): PoiFeatureCollection => emptyCollection();

describe('emptyCollection', () => {
  it('returns an empty FeatureCollection', () => {
    const c = emptyCollection();
    expect(c.type).toBe('FeatureCollection');
    expect(c.features).toHaveLength(0);
  });
});

describe('createPoi', () => {
  it('creates a Feature with correct geometry', () => {
    const poi = createPoi(coords, 'Test', 'park');
    expect(poi.type).toBe('Feature');
    expect(poi.geometry.type).toBe('Point');
    expect(poi.geometry.coordinates).toEqual([-74.07, 4.71]);
  });

  it('trims name and category', () => {
    const poi = createPoi(coords, '  Plaza  ', '  park  ');
    expect(poi.properties.name).toBe('Plaza');
    expect(poi.properties.category).toBe('park');
  });

  it('assigns a unique id', () => {
    const a = createPoi(coords, 'A', 'park');
    const b = createPoi(coords, 'B', 'park');
    expect(a.id).not.toBe(b.id);
  });

  it('accepts extra properties', () => {
    const poi = createPoi(coords, 'X', 'park', { rating: 5 });
    expect(poi.properties['rating']).toBe(5);
  });
});

describe('addPoi', () => {
  it('appends a POI to the collection', () => {
    const poi = createPoi(coords, 'A', 'park');
    const c   = addPoi(baseCollection(), poi);
    expect(c.features).toHaveLength(1);
    expect(c.features[0].properties.name).toBe('A');
  });

  it('does not mutate the original collection', () => {
    const original = baseCollection();
    addPoi(original, createPoi(coords, 'A', 'park'));
    expect(original.features).toHaveLength(0);
  });
});

describe('updatePoi', () => {
  it('updates name and category of a POI', () => {
    const poi = createPoi(coords, 'Old', 'park');
    const c   = addPoi(baseCollection(), poi);
    const updated = updatePoi(c, poi.id!, { name: 'New', category: 'cafe' });
    expect(updated.features[0].properties.name).toBe('New');
    expect(updated.features[0].properties.category).toBe('cafe');
  });

  it('does not affect other POIs', () => {
    const a = createPoi(coords, 'A', 'park');
    const b = createPoi(coords, 'B', 'cafe');
    let c = addPoi(baseCollection(), a);
    c = addPoi(c, b);
    const updated = updatePoi(c, a.id!, { name: 'A Updated' });
    expect(updated.features[1].properties.name).toBe('B');
  });

  it('does not mutate original', () => {
    const poi = createPoi(coords, 'Original', 'park');
    const c   = addPoi(baseCollection(), poi);
    updatePoi(c, poi.id!, { name: 'Changed' });
    expect(c.features[0].properties.name).toBe('Original');
  });
});

describe('deletePoi', () => {
  it('removes a POI by id', () => {
    const poi = createPoi(coords, 'A', 'park');
    const c   = addPoi(baseCollection(), poi);
    const result = deletePoi(c, poi.id!);
    expect(result.features).toHaveLength(0);
  });

  it('does not affect other POIs', () => {
    const a = createPoi(coords, 'A', 'park');
    const b = createPoi(coords, 'B', 'cafe');
    let c = addPoi(baseCollection(), a);
    c = addPoi(c, b);
    const result = deletePoi(c, a.id!);
    expect(result.features).toHaveLength(1);
    expect(result.features[0].properties.name).toBe('B');
  });

  it('does not mutate original', () => {
    const poi = createPoi(coords, 'A', 'park');
    const c   = addPoi(baseCollection(), poi);
    deletePoi(c, poi.id!);
    expect(c.features).toHaveLength(1);
  });

  it('returns same collection if id not found', () => {
    const poi = createPoi(coords, 'A', 'park');
    const c   = addPoi(baseCollection(), poi);
    const result = deletePoi(c, 'nonexistent');
    expect(result.features).toHaveLength(1);
  });
});
