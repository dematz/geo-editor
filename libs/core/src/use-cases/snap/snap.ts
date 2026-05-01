/**
 * Rounds coordinates to a decimal grid. Default precision of 4 decimal places
 * provides ~11m accuracy at the equator — suitable for POI mapping without
 * excessive coordinate noise.
 */
export interface SnapOptions {
  precision?: number; // decimal places — default 4 (~11m at equator)
}

/**
 * Snaps coordinates to a grid of given precision (decimal degrees).
 * @param lng Longitude
 * @param lat Latitude
 * @param options Grid precision (default 4 decimal places)
 * @returns Snapped coordinates
 */
export function snapToGrid(
  lng: number,
  lat: number,
  options: SnapOptions = {}
): { lng: number; lat: number } {
  const factor = Math.pow(10, options.precision ?? 4);
  return {
    lng: Math.round(lng * factor) / factor,
    lat: Math.round(lat * factor) / factor,
  };
}
