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

/**
 * Returns true when a category value should be inferred.
 * Triggers on: missing, empty string, 'other', or 'custom'.
 */
function needsInference(category: string | undefined | null): boolean {
  if (!category) return true;                          // undefined, null, ''
  const normalized = category.trim().toLowerCase();
  return normalized === 'other' || normalized === 'custom' || normalized === '';
}

/**
 * Applies all smart fixes to a single POI: infers missing category and repairs swapped coordinates.
 * Returns a new feature object with fixes applied, leaving the original unchanged.
 *
 * FIX: needsInference() now catches empty string '' in addition to 'other' and 'custom'.
 * FIX: inferred category always maps to a valid CategoryId (no 'health' or 'landmark').
 *
 * @param feature POI feature to fix
 * @returns Fixed feature and flags indicating which fixes were applied
 */
export function applySmartFixer(feature: PoiFeature): FixerResult {
  let current = { ...feature };
  let categoryInferred    = false;
  let coordinatesRepaired = false;

  // ── FIX: detectar categoría vacía, 'other' y 'custom' ──
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

/**
 * Applies smart fixes to a collection of POI features.
 * Returns a new collection with all fixes applied and counters for what was fixed.
 * @param features Array of POI features to fix
 * @returns Fixed features and summary counts (categories inferred, coordinates repaired)
 */
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
