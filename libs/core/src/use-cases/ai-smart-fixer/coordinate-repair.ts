// Detects and fixes swapped Lat/Lon coordinates
// Heuristic: if |a| <= 90 and |b| > 90, coords are [lat, lon] — swap them

const VALID_LON = (v: number): boolean => v >= -180 && v <= 180;
const VALID_LAT = (v: number): boolean => v >= -90 && v <= 90;

export interface CoordRepairResult {
  readonly wasRepaired:    boolean;
  readonly originalCoords: [number, number];
  readonly repairedCoords: [number, number];
}

export function repairCoordinates(coords: [number, number]): CoordRepairResult {
  const [a, b] = coords;

  // Already clearly invalid — nothing to repair
  if (!VALID_LON(a) && !VALID_LON(b)) {
    return { wasRepaired: false, originalCoords: coords, repairedCoords: coords };
  }

  // Definitive swap signal: a fits lat range only, b requires lon range
  // e.g. [4.71, -74.07] → a=4.71 (lat-only range), b=-74.07 (needs lon range)
  const aIsLatOnly = VALID_LAT(a) && !VALID_LAT(b);   // b > 90 or b < -90 → must be lon
  const bIsLatOnly = VALID_LAT(b) && !VALID_LAT(a);   // a > 90 or a < -90 → must be lon

  if (aIsLatOnly) {
    // a looks like lat, b looks like lon → swap
    return { wasRepaired: true, originalCoords: coords, repairedCoords: [b, a] };
  }

  if (bIsLatOnly) {
    // already correct: b is lat, a is lon — but this shouldn't reach here normally
    return { wasRepaired: false, originalCoords: coords, repairedCoords: coords };
  }

  // Both fit lat range — ambiguous, don't repair
  return { wasRepaired: false, originalCoords: coords, repairedCoords: coords };
}
