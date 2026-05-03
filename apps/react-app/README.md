# 🔵 React App — Geo-Editor POI

> Part of the [`geo-editor`](../../README.md) monorepo.
> Framework: **React 19** · State: **Zustand** · Bundler: **Vite 8** · UI: **@geo-editor/ui-react**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Design System Integration](#design-system-integration)
5. [State Management with Zustand](#state-management-with-zustand)
6. [Custom Hooks](#custom-hooks)
7. [Description Field](#description-field)
8. [Build & Docker](#build--docker)
9. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
pnpm install
pnpm nx serve react-app
# → http://localhost:3000
```

---

## Project Structure

```
apps/react-app/src/
├── App.tsx                    ← Root — layout + event wiring + history dependency
├── main.tsx                   ← Entry — imports @geo-editor/tokens before app CSS
├── index.css                  ← App shell layout only (.app-shell, .app-body, .app-map)
│
├── store/
│   └── poi.store.ts           ← Zustand store — description support + undo/redo
│
├── hooks/
│   ├── useMapLibre.ts         ← MapLibre — pendingDataRef buffer + snap
│   └── useFileIo.ts           ← GeoJSON import/export
│
├── components/
│   └── ImportReport.tsx       ← Import result banner (DS tokens inline, no external CSS)
│
└── utils/
    └── categoryMap.ts         ← Maps core category strings → CategoryId + SIDEBAR_CATEGORIES
```

---

## Architecture Overview

```
App.tsx (root coordinator)
    │
    ├── <TopBar />            search, undo/redo, import, export, clear (from @geo-editor/ui-react)
    ├── <ImportReport />      import result banner (DS tokens, self-contained)
    ├── <div ref={mapContainer} />  ← MapLibre renders here
    └── <aside>
        ├── <Sidebar />       POI list, categories, New POI (from @geo-editor/ui-react)
        └── <POIFormModal />  create/edit form with description (from @geo-editor/ui-react)
```

**Data flow — create POI:**
```
User clicks map
  → useMapLibre onMapClick (snapped coords via snapToGrid)
    → App state: pendingCoords set, showForm = true
      → <POIFormModal open /> with lat/lng pre-filled
        → User fills name, category, description → save
          → handleFormSave(data)
            → store.addPoint(coords, name, category, data.description)
              → addPoiCommand() → applyCommand() → history updated
                → useEffect([history]) → updateData() → map refreshed
                → <Sidebar /> re-renders with new POI
```

---

## Design System Integration

### Token import order

```typescript
// main.tsx — tokens must load before any component CSS
import '@geo-editor/tokens';  // ← CSS custom properties --ds-*
import './index.css';         // ← app shell layout (uses DS tokens)
import App from './App';
```

### Component imports

```typescript
// App.tsx
import {
  TopBar, Sidebar, POIFormModal,
  type POIFormData,
} from '@geo-editor/ui-react';
```

### Vite alias resolution

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@geo-editor/core': path.resolve(__dirname, '../../libs/core/src/index.ts'),
  },
},
```

**Note:** `@geo-editor/ui-react` is resolved via pnpm workspace symlink. `preserveSymlinks: true` was tested but breaks React's internal `scheduler` module resolution — the alias approach is used for `core` only.

### categoryMap.ts — bridging core ↔ DS

```typescript
// Maps wider core categories to the DS CategoryId union type
const RAW_TO_CAT: Record<string, CategoryId> = {
  restaurant: 'restaurant', cafe: 'restaurant',
  hotel: 'hotel',
  park: 'park', landmark: 'park', museum: 'park',
  hospital: 'hospital', health: 'hospital',
  shop: 'custom', transport: 'custom', education: 'custom',
  other: 'custom', custom: 'custom',
};
```

**Pending refactor:** `CategoryId` should move to `libs/core/src/domain/` to eliminate duplication with `@geo-editor/ui-angular`.

---

## State Management with Zustand

### Critical rule — `history` not `collection()` as `useEffect` dependency

```typescript
// ❌ WRONG — collection() has a stable function reference in Zustand
// useEffect never re-runs because the reference never changes
useEffect(() => {
  updateData(collection());
}, [collection, updateData]); // collection is always the same function

// ✅ CORRECT — history is the raw state object that changes on every mutation
useEffect(() => {
  updateData(collection());
}, [history, updateData]); // history reference changes → effect re-runs
```

**Why Zustand computed functions have stable references:** `collection`, `features`, `filteredFeatures` are plain functions defined in the store — their reference never changes. You must subscribe to the underlying state (`history`) that they read from.

### Store API

```typescript
// State (raw — use as useEffect deps)
history:    HistoryState
selectedId: string | number | null
filter:     FilterOptions

// Computed (call as functions — NOT suitable as useEffect deps)
collection()        → PoiFeatureCollection
features()          → PoiFeature[]
filteredFeatures()  → filtered by search query and categories
canUndo()           → boolean
canRedo()           → boolean

// Actions
restore()
addPoint(coords, name, category, description?)  // ← description optional
updatePoint(id, { name?, category?, description? })
removePoint(id)
selectPoint(id | null)
loadCollection(collection)
setFilter({ query?, categories? })
undo() / redo()
clearAll()
```

---

## Custom Hooks

### `useMapLibre(containerRef, onMapClick)`

```typescript
const { updateData, flyTo, highlightPoi } = useMapLibre(mapContainer, (coords) => {
  // coords already snapped to 4 decimal places (~11m)
  setPendingCoords(coords);
  setShowForm(true);
});
```

**`pendingDataRef` buffer pattern:**

```typescript
// Data arriving before map load is buffered and flushed on load
map.on('load', () => {
  setupLayers(map);
  styleLoaded.current = true;

  // Flush any data that arrived before load
  if (pendingDataRef.current) {
    source.setData(pendingDataRef.current);
    pendingDataRef.current = null;
  }
});

// Safe to call at any time — buffered if map not ready
const updateData = useCallback((collection: PoiFeatureCollection) => {
  if (!styleLoaded.current || !mapRef.current) {
    pendingDataRef.current = collection; // buffer for flush on load
    return;
  }
  source?.setData(collection);
}, []);
```

**Stable callback pattern:**

```typescript
// onMapClick stored in ref to avoid stale closures
// without this, the map event listener would capture the initial callback value
const onClickRef = useRef(onMapClick);
onClickRef.current = onMapClick; // always up-to-date

map.on('click', (e) => {
  onClickRef.current(snapped); // reads latest version
});
```

---

## Description Field

The `description` field flows end-to-end:

```
<POIFormModal /> (textarea — part of @geo-editor/ui-react)
  → handleFormSave(data: POIFormData)
    → store.addPoint(coords, name, category, data.description)
      → addPoiCommand(coords, name, category, description)
        → createPoi() with description in extraProps
          → PoiFeature.properties.description stored
            → JSON.stringify → localStorage persisted
```

On edit, `modalInitialData` derives description from the editing POI:
```typescript
const modalInitialData = editingPoi ? {
  id: String(editingPoi.id),
  name: editingPoi.properties.name,
  category: toCategoryId(editingPoi.properties.category),
  lat: editingPoi.geometry.coordinates[1].toString(),
  lng: editingPoi.geometry.coordinates[0].toString(),
  description: editingPoi.properties.description ?? '',  // ← restored
} : pendingCoords ? { ..., description: '' } : undefined;
```

Undo/Redo: `updatePoint()` captures `description` in `prev` snapshot:
```typescript
updatePoint: (id, updates) => {
  const poi = get().features().find(f => f.id === id);
  const prev = {
    name: poi.properties.name,
    category: poi.properties.category,
    description: poi.properties.description,  // ← captured for undo
  };
  const next = applyCommand(get().history, updatePoiCommand(id, prev, updates));
  ...
}
```

---

## Build & Docker

```bash
# Development (Vite HMR)
cd apps/react-app && npx vite

# Production build
cd apps/react-app && npx vite build
# Output: apps/react-app/dist/

# Docker
docker compose build react-client --no-cache
```

The Dockerfile uses `npx vite build` directly (bypassing `nx build react-app`) to avoid Nx cache issues in CI. The build context includes `libs/design-tokens` and `libs/design-system-react`.

---

## Troubleshooting

### POI markers not visible after restore / import
**Cause:** `useEffect` depended on `collection` (stable function ref) instead of `history` — effect never re-ran on state changes.
**Fix:** Use `history` as the `useEffect` dependency: `}, [history, updateData]);`

### POI markers visible then disappearing immediately
**Cause:** `updateData()` was called before `map.on('load')` fired. Guard `if (!styleLoaded.current) return` silently discarded data.
**Fix:** `useMapLibre` now buffers data in `pendingDataRef` and flushes it inside the `load` event handler.

### `n.features is undefined` (blank page)
**Cause:** Component calls `collection.features` — `collection` is a function in the Zustand store.
**Fix:** Always call as `collection().features`.

### `Cannot find module '@geo-editor/core'`
**Cause:** `tsconfig.app.json` has `paths` outside `compilerOptions`, or Vite alias missing.
**Fix:**
```json
{ "compilerOptions": { "paths": { "@geo-editor/core": ["../../libs/core/src/index.ts"] } } }
```

### Vite build fails: `Cannot resolve 'scheduler'`
**Cause:** `preserveSymlinks: true` in `vite.config.ts` breaks React internals.
**Fix:** Remove `preserveSymlinks`. Use alias only for `@geo-editor/core`.

### Imported POIs replace existing ones
**Cause:** `loadCollection()` called with only imported features.
**Fix:** Merge: `features: [...collection().features, ...result.imported]`.

### Hot reload not working for DS changes
**Fix:** Restart Vite dev server. If persists: `rm -rf apps/react-app/node_modules/.vite`.

### `pnpm-lock.yaml` out of date in Docker
**Fix:** Run `pnpm install` from monorepo root after any `package.json` change, commit updated lockfile.
