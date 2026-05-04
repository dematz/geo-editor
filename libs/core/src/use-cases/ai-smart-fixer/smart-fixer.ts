import type { PoiFeature } from '../../domain';
import { inferCategory } from './category-inference';
import { repairCoordinates } from './coordinate-repair';

export interface FixerResult {
  readonly feature:              PoiFeature;
  readonly categoryInferred:     boolean;
  readonly coordinatesRepaired:  boolean;
}

export interface SmartFixerSummary {
  readonly features:   PoiFeature[];
  readonly fixedCount: { categories: number; coordinates: number };
}

function needsInference(category: string | undefined | null): boolean {
  if (!category) return true;                          // undefined, null, ''
  const normalized = category.trim().toLowerCase();
  return normalized === 'other' || normalized === 'custom' || normalized === '';
}

export function applySmartFixer(feature: PoiFeature): FixerResult {
  let current = { ...feature };
  let categoryInferred    = false;
  let coordinatesRepaired = false;

  if (needsInference(current.properties.category)) {
    const inferred = inferCategory(current.properties.name);
    if (inferred) {
      current = { ...current, properties: { ...current.properties, category: inferred } };
      categoryInferred = true;
    }
  }

  const repair = repairCoordinates(current.geometry.coordinates);
  if (repair.wasRepaired) {
    current = { ...current, geometry: { ...current.geometry, coordinates: repair.repairedCoords } };
    coordinatesRepaired = true;
  }

  return { feature: current, categoryInferred, coordinatesRepaired };
}

export function applySmartFixerToCollection(features: PoiFeature[]): SmartFixerSummary {
  let categoriesFixed  = 0;
  let coordinatesFixed = 0;

  const fixed = features.map((f) => {
    const result = applySmartFixer(f);
    if (result.categoryInferred)    categoriesFixed++;
    if (result.coordinatesRepaired) coordinatesFixed++;
    return result.feature;
  });

  return { features: fixed, fixedCount: { categories: categoriesFixed, coordinates: coordinatesFixed } };
}
