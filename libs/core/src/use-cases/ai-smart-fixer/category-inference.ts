// Pattern-based category inference — 100% offline, no external API

interface CategoryRule {
  readonly patterns: RegExp[];
  readonly category: string;
}

const RULES: CategoryRule[] = [
  // ── Café ──────────────────────────────────────────────────────────────
  { patterns: [/starbucks|coffee|café|cafe|espresso|brew/i],
    category: 'cafe' },

  // ── Restaurant ────────────────────────────────────────────────────────
  { patterns: [/restaurant|burger|pizza|sushi|grill|bistro|food/i],
    category: 'restaurant' },

  // ── Hotel ─────────────────────────────────────────────────────────────
  { patterns: [/hotel|hostel|inn|lodge|resort|suites|motel/i],
    category: 'hotel' },

  // ── Park ──────────────────────────────────────────────────────────────
  { patterns: [/park|parque|garden|jardín|plaza|square|arví/i],
    category: 'park' },

  // ── Museum / Landmark — FIX: añadidos tower, palace, monument, etc. ──
  { patterns: [/museum|museo|gallery|galería|tower|torre|palace|palacio|monument|monumento|redentor|eiffel|colosseum|coliseo|christ|cristo|castle|castillo|cathedral|catedral|church|iglesia|mosque|mezquita|basilica|basílica/i],
    category: 'museum' },

  // ── Transport ─────────────────────────────────────────────────────────
  { patterns: [/airport|aeropuerto|terminal|vuelos/i],
    category: 'transport' },
  { patterns: [/station|estacion|metro|bus|train|tren/i],
    category: 'transport' },

  // ── Hospital — FIX: cambiado de 'health' a 'hospital' ─────────────────
  { patterns: [/hospital|clinic|farmacia|pharmacy|health|salud|clínica/i],
    category: 'hospital' },

  // ── Education ─────────────────────────────────────────────────────────
  { patterns: [/university|universidad|school|colegio|campus|instituto|institute/i],
    category: 'education' },

  // ── Shop ──────────────────────────────────────────────────────────────
  { patterns: [/mall|centro comercial|shop|tienda|store|market|zona rosa/i],
    category: 'shop' },
];

/**
 * Infers a POI category from its name using pattern-based rules.
 * All returned values match the current CategoryId union type.
 * Rules cover: cafe, restaurant, hotel, park, museum, transport, hospital, education, shop.
 * Landmarks and monuments (tower, palace, monument, etc.) are mapped to 'museum'.
 * @param name POI name to classify
 * @returns Matched CategoryId string or null (caller typically defaults to 'custom')
 */
export function inferCategory(name: string): string | null {
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(name))) return rule.category;
  }
  return null;
}
