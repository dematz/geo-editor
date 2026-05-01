import { describe, it, expect } from 'vitest';
import { filterPois } from '../poi-filter';
import { createPoi } from '../../poi.use-cases';

const coords = { lng: -74.07, lat: 4.71 };
const features = [
  createPoi(coords, 'Parque Central', 'park'),
  createPoi(coords, 'Cafe Velvet',    'cafe'),
  createPoi(coords, 'Hotel Dann',     'hotel'),
  createPoi(coords, 'Parque Norte',   'park'),
];

describe('filterPois', () => {
  it('returns all features when no filter applied', () => {
    expect(filterPois(features, {})).toHaveLength(4);
  });

  it('filters by query (case-insensitive)', () => {
    const result = filterPois(features, { query: 'parque' });
    expect(result).toHaveLength(2);
    expect(result.every((f) => f.properties.name.toLowerCase().includes('parque'))).toBe(true);
  });

  it('returns empty array when query matches nothing', () => {
    expect(filterPois(features, { query: 'xyz-not-found' })).toHaveLength(0);
  });

  it('filters by single category', () => {
    const result = filterPois(features, { categories: ['park'] });
    expect(result).toHaveLength(2);
    expect(result.every((f) => f.properties.category === 'park')).toBe(true);
  });

  it('filters by multiple categories', () => {
    const result = filterPois(features, { categories: ['park', 'cafe'] });
    expect(result).toHaveLength(3);
  });

  it('combines query and category filters', () => {
    const result = filterPois(features, { query: 'parque', categories: ['park'] });
    expect(result).toHaveLength(2);
  });

  it('returns empty when category filter matches nothing', () => {
    expect(filterPois(features, { categories: ['museum'] })).toHaveLength(0);
  });

  it('ignores empty query string', () => {
    expect(filterPois(features, { query: '   ' })).toHaveLength(4);
  });

  it('does not mutate input array', () => {
    const original = [...features];
    filterPois(features, { query: 'parque' });
    expect(features).toHaveLength(original.length);
  });
});
