# ⚙️ Core Library — `@geo-editor/core`

> Part of the [`geo-editor`](../../README.md) monorepo.
> Pure TypeScript — zero framework dependencies. Zero browser API usage in use-cases.

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
11. [Pending Refactors](#pending-refactors)
12. [Troubleshooting](#troubleshooting)

---

## Design Principles

- **No framework imports** — never import from `@angular/*`, `react`, or UI libraries
- **No `any`** — strict TypeScript (`strict: true`, `noImplicitAny`, `noUnusedLocals`)
- **Pure functions** — same input → same output, no side effects in use-cases
- **Immutability** — all mutations return new objects; originals never modified
- **Interface-driven** — `IPoiRepository` allows swapping storage without touching use-cases
- **Node-testable** — no browser APIs in use-cases (only in `infrastructure/`)

---

## Module Structure

```
libs/core/src/
├── domain/
│   ├── geojson.types.ts         ← LngLat, PoiFeature, PoiProperties (incl. description?)
│   ├── validation.types.ts      ← ValidationError, ValidationErrorReason, ImportResult
│   ├── repository.interface.ts  ← IPoiRepository
│   └── index.ts
│
├── use-cases/
│   ├── poi.use-cases.ts         ← createPoi, addPoi, updatePoi, deletePoi, emptyCollection
│   │
│   ├── validators/
│   │   └── geojson.validator.ts ← validateFeatureCollection — main import pipeline
│   │
│   ├── ai-smart-fixer/
│   │   ├── category-inference.ts  ← inferCategory (11 pattern rules)
│   │   ├── coordinate-repair.ts   ← repairCoordinates (swap detection heuristic)
│   │   └── smart-fixer.ts         ← applySmartFixer, applySmartFixerToCollection
│   │
│   ├── history/
│   │   ├── command.types.ts     ← Command, HistoryState, applyCommand, undo, redo
│   │   └── poi.commands.ts      ← addPoiCommand (description?), removePoiCommand,
│   │                               updatePoiCommand (description), loadCollectionCommand
│   │
│   ├── search/
│   │   └── poi-filter.ts        ← filterPois by query and categories
│   │
│   ├── snap/
│   │   └── snap.ts              ← snapToGrid (4 decimal places default)
│   │
│   └── index.ts                 ← barrel export (all use-cases + types)
│
├── infrastructure/
│   ├── local-storage.repository.ts ← LocalStoragePoiRepository (IPoiRepository)
│   └── index.ts                    ← createPoiRepository() factory
│
└── index.ts                     ← root barrel
```

---

## Domain Types

### `PoiProperties`

```typescript
interface PoiProperties {
  name:         string;
  category:     string;
  description?: string;  // optional free-text — persisted via JSON.stringify
  [key: string]: string | number | boolean | null | undefined;
}
```

The index signature includes `undefined` to accommodate the optional `description` field without TypeScript errors on spread operations.

### `PoiFeature`

```typescript
interface PoiFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] }; // [lon, lat]
  properties: PoiProperties;
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

`LocalStoragePoiRepository` serializes the full `FeatureCollection` with `JSON.stringify`. All `PoiProperties` fields — including `description` — persist automatically.

### `ImportResult`

```typescript
interface ImportResult {
  imported:       PoiFeature[];
  errors:         ValidationError[];
  totalProcessed: number;
  summary:        string; // "Importadas 28 / Descartadas 3 · IA: 2 categorías inferidas"
}
```

---

## Use Cases

### POI CRUD (`poi.use-cases.ts`)

All functions are **pure** — return new objects, never mutate inputs.

```typescript
createPoi(coords: LngLat, name: string, category: string, extraProps?): PoiFeature

addPoi(collection, poi): PoiFeatureCollection

// description included in updates
updatePoi(
  collection,
  id,
  updates: Partial<{ name: string; category: string; description: string }>
): PoiFeatureCollection

deletePoi(collection, id): PoiFeatureCollection

emptyCollection(): PoiFeatureCollection
```

### GeoJSON Validator (`validators/geojson.validator.ts`)

Validation pipeline with inline AI Smart Fixer:

```
1. Root is FeatureCollection?
2. features is array?
3. Each feature: type = 'Feature'?
4. geometry exists and is Point?
5. coordinates is 2-element array?
6. ── AI Smart Fixer: repairCoordinates() BEFORE range check ──
7. [lon, lat] in WGS84 range?
8. properties exists?
9. properties.name is non-empty string?
10. ── AI Smart Fixer: inferCategory() if missing/other ──
11. Import feature
```

The fixer runs **inline** (not post-processing) to rescue features that would otherwise be discarded by step 6 (swapped coordinates) or step 10 (missing category).

---

## AI Smart Fixer

### Category Inference

```typescript
inferCategory(name: string): string | null
```

| Category | Trigger patterns |
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

Returns `null` if no pattern matches — feature falls back to `'other'`.

### Coordinate Repair

```typescript
repairCoordinates(coords: [number, number]): CoordRepairResult
```

**Heuristic:** if `|a| ≤ 90` AND `|b| > 90`, then `a` is latitude and `b` is longitude (stored in wrong order) — swap them.

**Limitation:** if both values fit within `[-90, 90]` (e.g. Colombian coordinates `[-74, 4.7]`), the case is ambiguous and left unchanged.

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

### Built-in commands

```typescript
// description? is passed to createPoi() via extraProps
addPoiCommand(coords, name, category, description?): Command

// description included in prev/next for correct undo semantics
updatePoiCommand(
  id,
  prev: Partial<{ name, category, description }>,
  next: Partial<{ name, category, description }>
): Command

removePoiCommand(poi): Command
loadCollectionCommand(prev, next): Command
```

### History behavior

```
applyCommand(history, cmd):
  → push present to past (capped at 50)
  → execute cmd on present → new present
  → clear future

undoHistory(history):
  → pop last from past → new present
  → push old present to future

redoHistory(history):
  → pop first from future → new present
  → push old present to past
```

**Description and undo/redo:** The `updatePoiCommand` captures `description` in both `prev` and `next`. Undoing a description edit restores the previous description correctly.

---

## Grid Snapping

```typescript
snapToGrid(lng: number, lat: number, options?: { precision?: number }): { lng, lat }
```

| Precision | ~Distance |
|---|---|
| 2 | ~1.1 km |
| 3 | ~110 m |
| **4 (default)** | **~11 m** |
| 5 | ~1.1 m |

---

## Infrastructure

### `LocalStoragePoiRepository`

```typescript
class LocalStoragePoiRepository implements IPoiRepository {
  private readonly STORAGE_KEY = 'poi_editor_state';
}
```

**Error handling:**
- `save()` — catches `QuotaExceededError`, rethrows with human-readable message
- `getAll()` — catches corrupt JSON, clears key, returns `null` (safe degradation)

**Description persistence:** `JSON.stringify` serializes all `PoiProperties` fields including `description`. No changes to the repository were needed to support the new field — the interface is property-agnostic.

---

## Testing

```bash
cd libs/core
pnpm vitest run              # run once
pnpm vitest run --coverage   # with HTML coverage report
pnpm vitest                  # watch mode
```

### Coverage

```
Test Files : 7 passed
Tests      : 71 passed

File                        | Stmts | Branch | Funcs |
----------------------------|-------|--------|-------|
poi.use-cases.ts            | 100%  | 100%   | 100%  |
geojson.validator.ts        |  90%  |  88%   | 100%  |
category-inference.ts       | 100%  | 100%   | 100%  |
coordinate-repair.ts        | 100%  | 100%   | 100%  |
smart-fixer.ts              | 100%  | 100%   | 100%  |
command.types.ts            | 100%  | 100%   | 100%  |
poi.commands.ts             | 100%  | 100%   | 100%  |
poi-filter.ts               | 100%  | 100%   | 100%  |
snap.ts                     | 100%  | 100%   | 100%  |
Overall                     |  96%  |  95%   |  91%  |
```

`infrastructure/` excluded — requires browser `localStorage` API unavailable in Node.js.

---

## How to Extend

### Add a new POI property (e.g. `phone`)

1. `domain/geojson.types.ts` — add `phone?: string` to `PoiProperties`
2. `use-cases/poi.use-cases.ts` — add `phone` to `updatePoi` updates type
3. `use-cases/history/poi.commands.ts` — add `phone` to `addPoiCommand` and `updatePoiCommand`
4. No changes to `LocalStoragePoiRepository` — serializes all properties automatically

### Add a new repository (e.g. HTTP API)

```typescript
export class HttpPoiRepository implements IPoiRepository {
  constructor(private readonly baseUrl: string) {}

  async save(data: PoiFeatureCollection): Promise<void> {
    await fetch(`${this.baseUrl}/pois`, { method: 'PUT', body: JSON.stringify(data) });
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

Zero changes to use-cases, services, or UI components.

---

## Pending Refactors

### `CategoryId` centralization (recommended before adding categories)

**Current state:** `CategoryId` type is duplicated in two places:
- `libs/design-system-react/src/utils/poi-types.ts`
- `libs/design-system-angular/src/utils/category-types.ts`

Both apps maintain their own `categoryMap.ts` to bridge between core's open `string` and the DS's restricted union type.

**Recommended:** Move `CategoryId` and `CATEGORY_IDS` array to `libs/core/src/domain/`:

```typescript
// libs/core/src/domain/category.types.ts
export type CategoryId = 'restaurant' | 'hotel' | 'park' | 'hospital' | 'custom';
export const CATEGORY_IDS: CategoryId[] = ['restaurant', 'hotel', 'park', 'hospital', 'custom'];
```

**What stays in each layer:**
- `design-tokens` — CSS color variables per category (`--ds-cat-restaurant`)
- `design-system-react/angular` — icons, color constants, labels (import `CategoryId` from core)
- `apps` — category-to-icon/color mappings for the specific DS

**Impact:** 5 files, low risk, zero functional change. Run before adding any new category.

---

## Troubleshooting

### `noUnusedLocals` build error in Docker
**Cause:** Test file imports something unused.
**Fix:** Remove the unused import. TypeScript `strict: true` enforces this during `tsc -p tsconfig.json`.

### `localStorage` errors in tests
**Expected behavior:** `LocalStoragePoiRepository` is excluded from test coverage because vitest runs in Node.js without browser APIs.

### Coordinate repair not triggering for Colombian coordinates
**Expected behavior:** `[-74, 4.7]` — both values fit within `[-90, 90]`. Heuristic cannot determine swap direction without geographic context. Documented in Known Limitations.

### Tests pass locally but fail in Docker
**Cause:** Test files have unused imports caught by `tsc` (but not vitest transpiler).
**Fix:** Always run `cd libs/core && npx tsc --noEmit` before committing.

### `description` not persisting after restart
**Cause:** `updatePoint()` called without passing `description` in updates.
**Fix:** Ensure the calling layer (App or store) passes `description: data.description` in the updates object.
