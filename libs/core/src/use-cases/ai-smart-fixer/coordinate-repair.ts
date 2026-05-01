const VALID_LON = (v: number): boolean => v >= -180 && v <= 180;
const VALID_LAT = (v: number): boolean => v >= -90 && v <= 90;

export interface CoordRepairResult {
  readonly wasRepaired:    boolean;
  readonly originalCoords: [number, number];
  readonly repairedCoords: [number, number];
}

/**
 * Detects and swaps inverted [lat, lon] coordinates to correct [lon, lat] order.
 * Only repairs unambiguous cases where one value fits only the latitude range (-90..90)
 * and the other exceeds it. Ambiguous coordinates (both fit lat range) are left as-is.
 * @param coords [lon, lat] or [lat, lon] coordinate pair
 * @returns Repair result with wasRepaired flag and repairedCoords (may equal originalCoords if no swap needed)
 */
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
    return { wasRepaired: true, originalCoords: coords, repairedCoords: [b, a] };
  }

  if (bIsLatOnly) {
    // [a, b] = [lon, lat] — already correct GeoJSON order, no swap needed
    return { wasRepaired: false, originalCoords: coords, repairedCoords: coords };
  }

  // Both fit lat range — ambiguous, don't repair
  return { wasRepaired: false, originalCoords: coords, repairedCoords: coords };
}
