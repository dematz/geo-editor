import { describe, it, expect } from 'vitest';
import { validateFeatureCollection } from '../geojson.validator';

const validFeature = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [-74.08, 4.71] },
  properties: { name: 'Test POI', category: 'landmark' },
};

describe('validateFeatureCollection', () => {
  it('accepts a valid FeatureCollection', () => {
    const result = validateFeatureCollection({
      type: 'FeatureCollection',
      features: [validFeature],
    });
    expect(result.imported).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects non-Point geometry', () => {
    const result = validateFeatureCollection({
      type: 'FeatureCollection',
      features: [{ ...validFeature, geometry: { type: 'LineString', coordinates: [] } }],
    });
    expect(result.errors[0].reason).toBe('INVALID_GEOMETRY_TYPE');
  });

  it('rejects out-of-range coordinates', () => {
    const result = validateFeatureCollection({
      type: 'FeatureCollection',
      features: [{ ...validFeature, geometry: { type: 'Point', coordinates: [200, 100] } }],
    });
    expect(result.errors[0].reason).toBe('COORDINATES_OUT_OF_RANGE');
  });

  it('rejects missing name', () => {
    const result = validateFeatureCollection({
      type: 'FeatureCollection',
      features: [{ ...validFeature, properties: { category: 'park' } }],
    });
    expect(result.errors[0].reason).toBe('MISSING_NAME');
  });

  // Smart Fixer now accepts missing category and defaults to 'other'
  it('imports feature with missing category (Smart Fixer fallback to "other")', () => {
    const result = validateFeatureCollection({
      type: 'FeatureCollection',
      features: [{ ...validFeature, properties: { name: 'Valid Name' } }],
    });
    expect(result.errors).toHaveLength(0);
    expect(result.imported[0].properties.category).toBe('other');
  });

  it('imports valid and discards invalid in mixed collection', () => {
    const result = validateFeatureCollection({
      type: 'FeatureCollection',
      features: [validFeature, { type: 'Feature', geometry: null, properties: null }],
    });
    expect(result.imported).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
  });

  it('generates correct summary string', () => {
    const result = validateFeatureCollection({
      type: 'FeatureCollection',
      features: [validFeature],
    });
    expect(result.summary).toMatch(/Importadas 1/);
  });

  it('rejects root that is not FeatureCollection', () => {
    const result = validateFeatureCollection({ type: 'Feature', features: [] });
    expect(result.errors[0].reason).toBe('INVALID_COLLECTION_TYPE');
    expect(result.totalProcessed).toBe(0);
  });

  it('rejects feature missing geometry', () => {
    const result = validateFeatureCollection({
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: null, properties: { name: 'X', category: 'Y' } }],
    });
    expect(result.errors[0].reason).toBe('MISSING_GEOMETRY');
  });

  it('rejects feature missing properties', () => {
    const result = validateFeatureCollection({
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [-74, 4] }, properties: null }],
    });
    expect(result.errors[0].reason).toBe('MISSING_PROPERTIES');
  });

  it('appends Smart Fixer suffix when categories are inferred', () => {
    const result = validateFeatureCollection({
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', geometry: { type: 'Point', coordinates: [-74, 4.7] }, properties: { name: 'Cafe Velvet', category: 'other' } },
      ],
    });
    expect(result.summary).toMatch(/IA:/);
  });
});
