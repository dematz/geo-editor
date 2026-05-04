import type {
  PoiFeature,
  ValidationError,
  ValidationErrorReason,
  ImportResult,
} from '../../domain';
import { repairCoordinates } from '../ai-smart-fixer/coordinate-repair';
import { inferCategory } from '../ai-smart-fixer/category-inference';
import { applySmartFixerToCollection } from '../ai-smart-fixer/smart-fixer';

const VALID_LON = (v: number): boolean => v >= -180 && v <= 180;
const VALID_LAT = (v: number): boolean => v >= -90 && v <= 90;

function buildError(
  index: number,
  reason: ValidationErrorReason,
  message: string,
  raw?: unknown
): ValidationError {
  return { index, reason, message, rawFeature: raw };
}

function reasonToSpanish(reason: ValidationErrorReason): string {
  const map: Record<ValidationErrorReason, string> = {
    INVALID_GEOMETRY_TYPE:    'tipo de geometría inválido',
    MISSING_GEOMETRY:         'sin geometría',
    COORDINATES_OUT_OF_RANGE: 'coordenadas fuera de rango',
    MISSING_COORDINATES:      'sin coordenadas',
    MISSING_PROPERTIES:       'sin properties',
    MISSING_NAME:             'sin name',
    MISSING_CATEGORY:         'sin category',
    INVALID_FEATURE_TYPE:     'tipo Feature inválido',
    INVALID_COLLECTION_TYPE:  'tipo FeatureCollection inválido',
  };
  return map[reason];
}

function buildSummary(imported: number, errors: ValidationError[]): string {
  if (errors.length === 0) return `Importadas ${imported} / Sin errores`;

  const counts: Partial<Record<ValidationErrorReason, number>> = {};
  for (const e of errors) {
    counts[e.reason] = (counts[e.reason] ?? 0) + 1;
  }

  const details = Object.entries(counts)
    .map(([reason, count]) => `${count} ${reasonToSpanish(reason as ValidationErrorReason)}`)
    .join(', ');

  return `Importadas ${imported} / Descartadas ${errors.length} (${details})`;
}

export function validateFeatureCollection(raw: unknown): ImportResult {
  const errors: ValidationError[] = [];
  const imported: PoiFeature[] = [];

  if (
    typeof raw !== 'object' ||
    raw === null ||
    (raw as Record<string, unknown>)['type'] !== 'FeatureCollection'
  ) {
    return {
      imported: [],
      errors: [buildError(0, 'INVALID_COLLECTION_TYPE', 'Root is not a FeatureCollection', raw)],
      totalProcessed: 0,
      summary: 'Importadas 0 / Descartadas 1 (tipo FeatureCollection inválido)',
    };
  }

  const features = (raw as Record<string, unknown>)['features'];
  if (!Array.isArray(features)) {
    return {
      imported: [],
      errors: [buildError(0, 'INVALID_COLLECTION_TYPE', '"features" is not an array')],
      totalProcessed: 0,
      summary: 'Importadas 0 / Descartadas 1 (tipo FeatureCollection inválido)',
    };
  }

  features.forEach((feat: unknown, index: number) => {
    const f = feat as Record<string, unknown>;

    if (f['type'] !== 'Feature') {
      errors.push(buildError(index, 'INVALID_FEATURE_TYPE', `Feature[${index}].type is not "Feature"`, feat));
      return;
    }

    if (!f['geometry'] || typeof f['geometry'] !== 'object') {
      errors.push(buildError(index, 'MISSING_GEOMETRY', `Feature[${index}] has no geometry`, feat));
      return;
    }

    const geom = f['geometry'] as Record<string, unknown>;

    if (geom['type'] !== 'Point') {
      errors.push(buildError(index, 'INVALID_GEOMETRY_TYPE', `Feature[${index}] geometry is "${geom['type']}", expected "Point"`, feat));
      return;
    }

    const coords = geom['coordinates'];
    if (!Array.isArray(coords) || coords.length < 2) {
      errors.push(buildError(index, 'MISSING_COORDINATES', `Feature[${index}] has invalid coordinates`, feat));
      return;
    }

    let [lon, lat] = coords as number[];
    let coordsRepaired = false;
    const repairResult = repairCoordinates([lon, lat]);
    if (repairResult.wasRepaired) {
      [lon, lat] = repairResult.repairedCoords;
      coordsRepaired = true;
    }

    if (!VALID_LON(lon) || !VALID_LAT(lat)) {
      errors.push(buildError(index, 'COORDINATES_OUT_OF_RANGE', `Feature[${index}] coords [${coords[0]}, ${coords[1]}] out of WGS84 range`, feat));
      return;
    }

    if (!f['properties'] || typeof f['properties'] !== 'object') {
      errors.push(buildError(index, 'MISSING_PROPERTIES', `Feature[${index}] has no properties`, feat));
      return;
    }

    const props = f['properties'] as Record<string, unknown>;

    if (typeof props['name'] !== 'string' || props['name'].trim() === '') {
      errors.push(buildError(index, 'MISSING_NAME', `Feature[${index}] properties.name is missing or not a string`, feat));
      return;
    }

    const rawCategory = typeof props['category'] === 'string' && props['category'].trim() !== ''
      ? props['category'].trim()
      : (inferCategory(props['name'] as string) ?? 'other');

    imported.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lon, lat] },
      properties: {
        ...(props as { name: string; [k: string]: string | number | boolean | null }),
        category: rawCategory,
      },
      id: (f['id'] as string | number | undefined) ?? `poi-${index}-${Date.now()}`,
      ...(coordsRepaired ? { _coordsRepaired: true } : {}),
    });
  });

  const fixerResult = applySmartFixerToCollection(imported);

  const fixerSuffix =
    fixerResult.fixedCount.categories > 0 || fixerResult.fixedCount.coordinates > 0
      ? ` · IA: ${fixerResult.fixedCount.categories} categorías inferidas, ${fixerResult.fixedCount.coordinates} coordenadas corregidas`
      : '';

  return {
    imported: fixerResult.features,
    errors,
    totalProcessed: features.length,
    summary: buildSummary(fixerResult.features.length, errors) + fixerSuffix,
  };
}
