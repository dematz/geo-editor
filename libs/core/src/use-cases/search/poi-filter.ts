import type { PoiFeature } from '../../domain';

export interface FilterOptions {
  query?:      string;
  categories?: string[];
}

export function filterPois(features: PoiFeature[], options: FilterOptions): PoiFeature[] {
  let result = features;

  if (options.query && options.query.trim().length > 0) {
    const q = options.query.trim().toLowerCase();
    result = result.filter((f) => f.properties.name.toLowerCase().includes(q));
  }

  if (options.categories && options.categories.length > 0) {
    result = result.filter((f) => options.categories!.includes(f.properties.category));
  }

  return result;
}
