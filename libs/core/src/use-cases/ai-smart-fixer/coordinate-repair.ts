const VALID_LON = (v: number): boolean => v >= -180 && v <= 180;
const VALID_LAT = (v: number): boolean => v >= -90 && v <= 90;

export interface CoordRepairResult {
  readonly wasRepaired:    boolean;
  readonly originalCoords: [number, number];
  readonly repairedCoords: [number, number];
}

export function repairCoordinates(coords: [number, number]): CoordRepairResult {
  const [a, b] = coords;

  if (!VALID_LON(a) && !VALID_LON(b)) {
    return { wasRepaired: false, originalCoords: coords, repairedCoords: coords };
  }

  const aIsLatOnly = VALID_LAT(a) && !VALID_LAT(b);   // b > 90 or b < -90 → must be lon
  const bIsLatOnly = VALID_LAT(b) && !VALID_LAT(a);   // a > 90 or a < -90 → must be lon

  if (aIsLatOnly) {
    return { wasRepaired: true, originalCoords: coords, repairedCoords: [b, a] };
  }

  if (bIsLatOnly) {
    return { wasRepaired: false, originalCoords: coords, repairedCoords: coords };
  }

  return { wasRepaired: false, originalCoords: coords, repairedCoords: coords };
}
