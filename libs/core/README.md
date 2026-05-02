# ⚙️ Core Library — `@geo-editor/core`

> Part of the [`geo-editor`](../../README.md) monorepo.
> Pure TypeScript — zero framework dependencies.

This library contains all business logic shared between the Angular and React apps. It is intentionally framework-agnostic: no Angular, React, RxJS, or browser APIs (except `localStorage` in the infrastructure layer).

---

## 📋 Table of Contents

1. [Design Principles](#design-principles)
2. [Module Structure](#module-structure)
3. [Domain Types](#domain-types)
4. [Use Cases](#use-cases)
5. [AI Smart Fixer](#ai-smart-fixer)
6. [History — Undo/Redo](#history--undoredo)
7. [Grid Snapping](#grid-snapping)
8. [Infrastructure](#infrastructure)
9. [Testing](#testing)
10. [How to Extend](#how-to-extend)
11. [Troubleshooting](#troubleshooting)

---

## Design Principles

- **No framework imports** — `libs/core` must never import from `@angular/*`, `react`, or any UI library.
- **No `any`** — strict TypeScript (`strict: true`, `noImplicitAny: true`, `noUnusedLocals: true`).
- **Pure functions** — use-cases are pure: same input → same output, no side effects.
- **Immutability** — all collection mutations return new objects; originals are never modified.
- **Interface-driven** — `IPoiRepository` allows swapping storage without changing use-cases.
- **Testable in Node** — no browser APIs in use-cases (only in `infrastructure/`).

---

## Module Structure

```
libs/core/src/
├── domain/
│   ├── geojson.types.ts         ← LngLat, PoiFeature, PoiFeatureCollection
│   ├── validation.types.ts      ← ValidationError, ImportResult
│   ├── repository.interface.ts  ← IPoiRepository
│   └── index.ts                 ← barrel export
│
├── use-cases/
│   ├── poi.use-cases.ts         ← createPoi, addPoi, updatePoi, deletePoi, emptyCollection
│   │
│   ├── validators/
│   │   └── geojson.validator.ts ← validateFeatureCollection (main import pipeline)
│   │
│   ├── ai-smart-fixer/
│   │   ├── category-inference.ts  ← inferCategory (pattern matching)
│   │   ├── coordinate-repair.ts   ← repairCoordinates (swap detection)
│   │   └── smart-fixer.ts         ← applySmartFixer, applySmartFixerToCollection
│   │
│   ├── history/
│   │   ├── command.types.ts     ← Command interface, HistoryState, applyCommand, undo, redo
│   │   └── poi.commands.ts      ← addPoiCommand, removePoiCommand, updatePoiCommand, loadCollectionCommand
│   │
│   ├── search/
│   │   └── poi-filter.ts        ← filterPois (by name query and categories)
│   │
│   ├── snap/
│   │   └── snap.ts              ← snapToGrid (coordinate rounding)
│   │
│   └── index.ts                 ← barrel export (all use-cases)
│
├── infrastructure/
│   ├── local-storage.repository.ts ← LocalStoragePoiRepository (implements IPoiRepository)
│   └── index.ts
│
└── index.ts                     ← root barrel (domain + use-cases + infrastructure)
```

---

## Domain Types

### `LngLat`
```typescript
interface LngLat {
  readonly lng: number;
  readonly lat: number;
}
```

### `PoiFeature`
```typescript
interface PoiFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] }; // [lon, lat]
  properties: PoiProperties;  // { name: string; category: string; [key]: ... }
  id?: string | number;
}
```

### `IPoiRepository`
```typescript
interface IPoiRepository {
  save(data: PoiFeatureCollection): Promise<void>;
  getAll(): Promise<PoiFeatureCollection | null>;
  clear(): Promise<void>;
}
```

### `ImportResult`
```typescript
interface ImportResult {
  imported:       PoiFeature[];
  errors:         ValidationError[];
  totalProcessed: number;
  summary:        string; // "Importadas 28 / Descartadas 3 (2 coord. inválidas, 1 sin name)"
}
```

---

## Use Cases

### POI CRUD (`poi.use-cases.ts`)

All functions are **pure** — they return new objects and never mutate inputs.

```typescript
// Create a new POI Feature
createPoi(coords: LngLat, name: string, category: string, extraProps?): PoiFeature

// Add POI to collection (returns new collection)
addPoi(collection: PoiFeatureCollection, poi: PoiFeature): PoiFeatureCollection

// Update POI properties (returns new collection)
updatePoi(collection, id, updates: Partial<{name, category}>): PoiFeatureCollection

// Remove POI (returns new collection)
deletePoi(collection: PoiFeatureCollection, id: string | number): PoiFeatureCollection

// Create empty collection
emptyCollection(): PoiFeatureCollection
```

### GeoJSON Validator (`validators/geojson.validator.ts`)

The main import pipeline. Validates a raw unknown value against GeoJSON Point FeatureCollection rules:

```typescript
validateFeatureCollection(raw: unknown): ImportResult
```

**Validation rules (in order):**
1. Root must be `{ type: 'FeatureCollection', features: [] }`
2. Each feature must have `type: 'Feature'`
3. `geometry` must exist and be `{ type: 'Point' }`
4. Coordinates must be a 2-element array
5. **Smart Fixer: attempt coordinate repair before range check**
6. `[lon, lat]` must be in WGS84 range (`lon ∈ [-180,180]`, `lat ∈ [-90,90]`)
7. `properties` must exist
8. `properties.name` must be a non-empty string
9. **Smart Fixer: infer category if missing or `'other'`**

The AI Smart Fixer runs **inline during validation** — not as a post-processing step — allowing it to rescue features that would otherwise be discarded.

### Search / Filter (`search/poi-filter.ts`)

```typescript
filterPois(features: PoiFeature[], options: FilterOptions): PoiFeature[]

interface FilterOptions {
  query?:      string;    // case-insensitive name search
  categories?: string[];  // exact category match
}
```

Both filters are combined with AND logic. Does not mutate input array.

---

## AI Smart Fixer

### Category Inference (`ai-smart-fixer/category-inference.ts`)

Pattern-based, fully offline — no external API.

```typescript
inferCategory(name: string): string | null
```

**Supported categories and trigger patterns:**

| Category | Patterns |
|---|---|
| `cafe` | starbucks, coffee, café, espresso, brew |
| `restaurant` | restaurant, burger, pizza, sushi, grill, bistro, food |
| `hotel` | hotel, hostel, inn, lodge, resort, suites, motel |
| `park` | park, parque, garden, jardín, plaza, square |
| `museum` | museum, museo, gallery, galería |
| `transport` | airport, aeropuerto, terminal, station, estacion, metro, bus, train |
| `health` | hospital, clinic, farmacia, pharmacy, health, salud |
| `education` | university, universidad, school, colegio, campus |
| `shop` | mall, centro comercial, shop, tienda, store, market |
| `landmark` | church, iglesia, cathedral, catedral, mosque, mezquita |

Returns `null` if no pattern matches.

### Coordinate Repair (`ai-smart-fixer/coordinate-repair.ts`)

Detects and fixes swapped `[lat, lon]` coordinates stored as `[lon, lat]`.

```typescript
repairCoordinates(coords: [number, number]): CoordRepairResult
```

**Heuristic:** If `|a| <= 90` (fits lat range) AND `|b| > 90` (can only be longitude), the coordinates are considered swapped and repaired.

**Limitation:** If both values fit within `[-90, 90]` (e.g. Colombian coordinates `[-74, 4.7]`), the case is ambiguous and left unchanged. Geographic context would be needed to resolve this.

---

## History — Undo/Redo

### `Command` interface

```typescript
interface Command {
  readonly description: string;
  execute(state: PoiFeatureCollection): PoiFeatureCollection;
  undo(state: PoiFeatureCollection): PoiFeatureCollection;
}
```

### `HistoryState`

```typescript
interface HistoryState {
  past:    PoiFeatureCollection[];  // capped at 50
  present: PoiFeatureCollection;
  future:  PoiFeatureCollection[];
}
```

### Core functions

```typescript
initHistory(initial: PoiFeatureCollection): HistoryState
applyCommand(history: HistoryState, command: Command): HistoryState
undoHistory(history: HistoryState): HistoryState
redoHistory(history: HistoryState): HistoryState
canUndo(history: HistoryState): boolean
canRedo(history: HistoryState): boolean
```

### Built-in Commands

```typescript
addPoiCommand(coords, name, category): Command
removePoiCommand(poi: PoiFeature): Command
updatePoiCommand(id, prev, next): Command
loadCollectionCommand(prev, next): Command
```

**History behavior:**
- Every `applyCommand` pushes `present` to `past` and clears `future`
- `undoHistory` pops from `past`, pushes `present` to `future`
- `redoHistory` pops from `future`, pushes `present` to `past`
- `past` is capped at 50 entries (oldest are dropped)

---

## Grid Snapping

```typescript
snapToGrid(lng: number, lat: number, options?: SnapOptions): { lng: number; lat: number }

interface SnapOptions {
  precision?: number; // decimal places, default: 4 (~11m precision at equator)
}
```

**Precision reference:**

| Decimals | Precision |
|---|---|
| 1 | ~11 km |
| 2 | ~1.1 km |
| 3 | ~110 m |
| **4 (default)** | **~11 m** |
| 5 | ~1.1 m |

---

## Infrastructure

### `LocalStoragePoiRepository`

Implements `IPoiRepository` using browser `localStorage`.

```typescript
class LocalStoragePoiRepository implements IPoiRepository {
  private readonly STORAGE_KEY = 'poi_editor_state';
  async save(data: PoiFeatureCollection): Promise<void>
  async getAll(): Promise<PoiFeatureCollection | null>
  async clear(): Promise<void>
}
```

**Error handling:**
- `save()` — catches `QuotaExceededError` and rethrows with a human-readable message
- `getAll()` — catches `JSON.parse` errors (corrupt data), clears the key, and returns `null`

**Factory function:**
```typescript
// Preferred way to instantiate — enables easy mocking in tests
createPoiRepository(): IPoiRepository
```

> This class is **excluded from test coverage** because it requires browser `localStorage` API not available in Node.js vitest environment.

---

## Testing

```bash
# Run all tests
cd libs/core && pnpm vitest run

# Run with HTML coverage report
cd libs/core && pnpm vitest run --coverage
# Report saved to: libs/core/coverage/

# Watch mode
cd libs/core && pnpm vitest
```

### Test files

| File | Tests | Coverage |
|---|---|---|
| `poi.use-cases.spec.ts` | 14 | 100% |
| `geojson.validator.spec.ts` | 11 | 90% |
| `smart-fixer.spec.ts` | 14 | 100% |
| `command.spec.ts` | 12 | 100% |
| `poi.commands.spec.ts` | 7 | 100% |
| `poi-filter.spec.ts` | 9 | 100% |
| `snap.spec.ts` | 4 | 100% |
| **Total** | **71** | **96%** |

### Writing a new test

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../my-module';

describe('myFunction', () => {
  it('does the expected thing', () => {
    const result = myFunction(input);
    expect(result).toEqual(expected);
  });
});
```

Place the file in `__tests__/` next to the module being tested.

---

## How to Extend

### Add a new repository (e.g. HTTP API)

```typescript
// libs/core/src/infrastructure/http.repository.ts
import type { IPoiRepository, PoiFeatureCollection } from '../domain';

export class HttpPoiRepository implements IPoiRepository {
  constructor(private readonly baseUrl: string) {}

  async save(data: PoiFeatureCollection): Promise<void> {
    await fetch(`${this.baseUrl}/pois`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getAll(): Promise<PoiFeatureCollection | null> {
    const res = await fetch(`${this.baseUrl}/pois`);
    return res.ok ? res.json() : null;
  }

  async clear(): Promise<void> {
    await fetch(`${this.baseUrl}/pois`, { method: 'DELETE' });
  }
}
```

No changes needed in use-cases, services, or components.

### Add a new Command

```typescript
// libs/core/src/use-cases/history/poi.commands.ts
export function movePoiCommand(id: string | number, from: LngLat, to: LngLat): Command {
  return {
    description: `Move POI to [${to.lng}, ${to.lat}]`,
    execute: (state) => /* update coordinates */,
    undo:    (state) => /* restore original coordinates */,
  };
}
```

Then export from `use-cases/index.ts`.

### Add a new category to AI Smart Fixer

```typescript
// libs/core/src/use-cases/ai-smart-fixer/category-inference.ts
const RULES: CategoryRule[] = [
  // ... existing rules ...
  { patterns: [/beach|playa|surf|ocean/i], category: 'beach' },
];
```

No other changes needed.

---

## Troubleshooting

### `noUnusedLocals` build error in Docker
**Cause:** A test file imports something that isn't used.
**Fix:** Remove unused imports. TypeScript's `strict: true` enforces this in the core build.

### `localStorage` not available in tests
**Cause:** Vitest runs in Node environment, not browser.
**Fix:** This is expected. `LocalStoragePoiRepository` is excluded from test coverage via `vitest.config.ts`:
```typescript
coverage: {
  exclude: ['src/infrastructure/**'],
}
```
Mock the repository in integration tests if needed.

### `Cannot find module '@geo-editor/core'`
**Cause:** The consuming app's `tsconfig` or Vite alias doesn't point to `libs/core/src/index.ts`.
**Fix for Angular:** Add to `tsconfig.app.json` `compilerOptions.paths`.
**Fix for React:** Add to `vite.config.ts` `resolve.alias`.

### Coordinate repair not triggering for Colombian coordinates
**Cause:** Both `[-74, 4.7]` values fit within `[-90, 90]` — the heuristic cannot determine which is lat and which is lon without geographic context.
**Expected behavior:** Ambiguous cases are left unchanged. This is documented in Known Limitations.

### Tests pass locally but fail in Docker (TypeScript errors)
**Cause:** Test files have unused imports that `noUnusedLocals` catches during `tsc -p tsconfig.json`.
**Fix:** Vitest does not run `tsc` — it transpiles only. The Docker build runs `tsc` explicitly. Always run `cd libs/core && npx tsc --noEmit` before committing.
