// Pattern-based category inference — 100% offline, no external API

interface CategoryRule {
  readonly patterns: RegExp[];
  readonly category: string;
}

const RULES: CategoryRule[] = [
  { patterns: [/starbucks|coffee|café|cafe|espresso|brew/i],           category: 'cafe' },
  { patterns: [/restaurant|burger|pizza|sushi|grill|bistro|food/i],    category: 'restaurant' },
  { patterns: [/hotel|hostel|inn|lodge|resort|suites|motel/i],         category: 'hotel' },
  { patterns: [/park|parque|garden|jardín|plaza|square/i],             category: 'park' },
  { patterns: [/museum|museo|gallery|galería/i],                       category: 'museum' },
  { patterns: [/airport|aeropuerto|terminal|vuelos/i],                 category: 'transport' },
  { patterns: [/station|estacion|metro|bus|train|tren/i],              category: 'transport' },
  { patterns: [/hospital|clinic|farmacia|pharmacy|health|salud/i],     category: 'health' },
  { patterns: [/university|universidad|school|colegio|campus/i],       category: 'education' },
  { patterns: [/mall|centro comercial|shop|tienda|store|market/i],     category: 'shop' },
  { patterns: [/church|iglesia|cathedral|catedral|mosque|mezquita/i],  category: 'landmark' },
];

/**
 * Infers a POI category from its name using pattern-based rules.
 * Rules cover common venue types (cafe, restaurant, hotel, park, museum, etc.).
 * @param name POI name to classify
 * @returns Matched category or null (caller typically defaults to 'other')
 */
export function inferCategory(name: string): string | null {
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(name))) return rule.category;
  }
  return null;
}
