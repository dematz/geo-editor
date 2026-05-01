import { describe, it, expect } from 'vitest';
import { inferCategory } from '../category-inference';
import { repairCoordinates } from '../coordinate-repair';
import { applySmartFixer, applySmartFixerToCollection } from '../smart-fixer';
import type { PoiFeature } from '../../../domain';

const makeFeature = (name: string, category: string, coords: [number, number]): PoiFeature => ({
  type: 'Feature',
  geometry: { type: 'Point', coordinates: coords },
  properties: { name, category },
  id: 'test-1',
});

// ── inferCategory ──────────────────────────────────────────
describe('inferCategory', () => {
  it('infers cafe from "Starbucks Centro"', () => {
    expect(inferCategory('Starbucks Centro')).toBe('cafe');
  });
  it('infers restaurant from "Pizza Hut"', () => {
    expect(inferCategory('Pizza Hut')).toBe('restaurant');
  });
  it('infers transport from "Estacion del Metro"', () => {
    expect(inferCategory('Estacion del Metro')).toBe('transport');
  });
  it('infers museum from "Museo de Antioquia"', () => {
    expect(inferCategory('Museo de Antioquia')).toBe('museum');
  });
  it('returns null for unrecognized names', () => {
    expect(inferCategory('XYZ Unknown Place')).toBeNull();
  });
});

// ── repairCoordinates ──────────────────────────────────────
describe('repairCoordinates', () => {
  it('does not repair valid coords [lon, lat] where lon > 90', () => {
    // e.g. Eastern Europe: lon=139, lat=35 → clearly [lon, lat]
    const result = repairCoordinates([139.69, 35.68]);
    expect(result.wasRepaired).toBe(false);
  });

  it('repairs swapped [lat, lon] when lat fits only lat range and lon does not', () => {
    // [4.71, -74.07]: 4.71 fits lat only if -74.07 forces lon role
    // but both fit lat range → ambiguous. Use clear case:
    // [35.68, 139.69]: 35.68=lat, 139.69=lon (> 90 so can only be lon)
    const result = repairCoordinates([35.68, 139.69]);
    expect(result.wasRepaired).toBe(true);
    expect(result.repairedCoords).toEqual([139.69, 35.68]);
  });

  it('does not repair truly out-of-range coords', () => {
    const result = repairCoordinates([200, 500]);
    expect(result.wasRepaired).toBe(false);
  });

  it('does not repair ambiguous coords where both fit lat range', () => {
    // Both 4.71 and -74.07 fit within [-90,90] → ambiguous, no repair
    const result = repairCoordinates([4.71, -74.07]);
    expect(result.wasRepaired).toBe(false);
  });
});

// ── applySmartFixer ────────────────────────────────────────
describe('applySmartFixer', () => {
  it('infers category when set to "other"', () => {
    const f = makeFeature('Parque Central', 'other', [-74, 4.7]);
    const result = applySmartFixer(f);
    expect(result.categoryInferred).toBe(true);
    expect(result.feature.properties.category).toBe('park');
  });

  it('does not override existing valid category', () => {
    const f = makeFeature('Parque Central', 'landmark', [-74, 4.7]);
    const result = applySmartFixer(f);
    expect(result.categoryInferred).toBe(false);
    expect(result.feature.properties.category).toBe('landmark');
  });

  it('repairs clearly swapped coordinates (lon > 90)', () => {
    // Tokyo: lat=35.68, lon=139.69 — if stored as [lat, lon] = [35.68, 139.69]
    const f = makeFeature('Tokyo Tower', 'landmark', [35.68, 139.69]);
    const result = applySmartFixer(f);
    expect(result.coordinatesRepaired).toBe(true);
    expect(result.feature.geometry.coordinates).toEqual([139.69, 35.68]);
  });

  it('does not repair ambiguous coords within lat range', () => {
    const f = makeFeature('Test', 'landmark', [4.71, -74.07]);
    const result = applySmartFixer(f);
    expect(result.coordinatesRepaired).toBe(false);
  });
});

// ── applySmartFixerToCollection ────────────────────────────
describe('applySmartFixerToCollection', () => {
  it('counts fixed categories and coordinates', () => {
    const features: PoiFeature[] = [
      makeFeature('Cafe Velvet',  'other',    [-74, 4.7]),     // category inferred
      makeFeature('Hotel Dann',   'other',    [-75, 6.2]),     // category inferred
      makeFeature('Tokyo Tower',  'landmark', [35.68, 139.69]), // coords repaired
    ];
    const result = applySmartFixerToCollection(features);
    expect(result.fixedCount.categories).toBe(2);
    expect(result.fixedCount.coordinates).toBe(1);
    expect(result.features).toHaveLength(3);
  });
});
