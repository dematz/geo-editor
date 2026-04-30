import type { PoiFeature } from './geojson.types';

export type ValidationErrorReason =
  | 'INVALID_GEOMETRY_TYPE'
  | 'MISSING_GEOMETRY'
  | 'COORDINATES_OUT_OF_RANGE'
  | 'MISSING_COORDINATES'
  | 'MISSING_PROPERTIES'
  | 'MISSING_NAME'
  | 'MISSING_CATEGORY'
  | 'INVALID_FEATURE_TYPE'
  | 'INVALID_COLLECTION_TYPE';

export interface ValidationError {
  readonly index: number;
  readonly reason: ValidationErrorReason;
  readonly message: string;
  readonly rawFeature?: unknown;
}

export interface ImportResult {
  readonly imported: PoiFeature[];
  readonly errors: ValidationError[];
  readonly totalProcessed: number;
  readonly summary: string; // "Importadas 28 / Descartadas 3 (2 coord. inválidas, 1 sin name)"
}
