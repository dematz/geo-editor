# 🔵 React App — Geo-Editor POI

> Part of the [`geo-editor`](../../README.md) monorepo.
> Framework: **React 19** · State: **Zustand** · Bundler: **Vite 8**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [State Management with Zustand](#state-management-with-zustand)
5. [Custom Hooks](#custom-hooks)
6. [Components](#components)
7. [MapLibre Integration](#maplibre-integration)
8. [Vite Configuration](#vite-configuration)
9. [How to Add a Feature](#how-to-add-a-feature)
10. [Build & Docker](#build--docker)
11. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# From monorepo root
pnpm install
pnpm nx serve react-app
# → http://localhost:3000
```

---

## Project Structure

```
apps/react-app/src/
├── App.tsx                    ← Root component — layout + state wiring
├── main.tsx                   ← ReactDOM.createRoot entry point
├── index.css                  ← Global styles (shared design tokens with Angular)
│
├── store/
│   └── poi.store.ts           ← Zustand store (all POI state + undo/redo)
│
├── hooks/
│   ├── useMapLibre.ts         ← MapLibre lifecycle, layers, click handler + snap
│   └── useFileIo.ts           ← GeoJSON import (validate) + export (download)
│
└── components/
    ├── Toolbar.tsx             ← Import / Export / Undo / Redo / Clear
    ├── PoiList.tsx             ← Sidebar list with search input
    ├── PoiForm.tsx             ← Create/edit form with validation
    └── ImportReport.tsx        ← Import result banner with error details
```

---

## Architecture Overview

```
App.tsx (root, state coordinator)
    │
    ├── <Toolbar />           import / export / undo / redo / clear
    ├── <ImportReport />      shows import result banner
    ├── <div ref={mapContainer} />  ← MapLibre renders here
    └── <aside> (sidebar)
        ├── <PoiList />       list + search + select + edit + delete
        └── <PoiForm />       create (from map click) or edit POI
```

**Data flow:**
```
User clicks map
  → useMapLibre onMapClick callback
    → snapToGrid() applied
      → App.tsx state: pendingCoords set
        → <PoiForm /> appears
          → User submits → onSaved()
            → usePoiStore.addPoint()
              → applyCommand() → history updated
                → collection() returns new state
                  → useEffect syncs map → useMapLibre.updateData()
                  → <PoiList /> re-renders
```

---

## State Management with Zustand

All POI state lives in a single Zustand store (`poi.store.ts`). It wraps `@geo-editor/core` use-cases and exposes both state and actions.

```typescript
// State
history:    HistoryState         // present + past[] + future[]
selectedId: string | number | null
loading:    boolean
filter:     FilterOptions

// Computed (functions, not values — call them)
collection()        → PoiFeatureCollection
features()          → PoiFeature[]
filteredFeatures()  → PoiFeature[] (filtered by search)
canUndo()           → boolean
canRedo()           → boolean

// Actions
restore()                         // load from localStorage
addPoint(coords, name, category)  // undoable
updatePoint(id, updates)          // undoable
removePoint(id)                   // undoable
loadCollection(collection)        // undoable (import)
selectPoint(id | null)            // UI only, not undoable
setFilter(opts)                   // search filter, not undoable
undo()                            // steps back
redo()                            // steps forward
clearAll()                        // reset + clear localStorage
```

**Important:** `collection`, `features`, `filteredFeatures`, `canUndo`, `canRedo` are **functions** (not plain values) because Zustand does not support computed properties natively. Always call them:

```tsx
// ✅ Correct
const { collection, features } = usePoiStore();
collection().features.length
features().map(f => ...)

// ❌ Wrong — will cause "cannot read .features of undefined"
collection.features
```

### Undo/Redo pattern

Every mutation goes through `applyCommand()` from `@geo-editor/core`:

```typescript
addPoint: (coords, name, category) => {
  const next = applyCommand(get().history, addPoiCommand(coords, name, category));
  set({ history: next });
  repo.save(next.present).catch(console.error);
},
```

This keeps history immutable and side-effect free in the core.

---

## Custom Hooks

### `useMapLibre(containerRef, onMapClick)`

Manages the full MapLibre lifecycle: initialization, layer setup, event handlers, and cleanup.

```typescript
const { updateData, flyTo, highlightPoi } = useMapLibre(mapContainer, (coords) => {
  // coords already snapped to 4 decimal places
  setPendingCoords(coords);
  setShowForm(true);
});
```

**Key implementation details:**
- Map is initialized once in `useEffect([], [])` (empty deps)
- `onMapClick` is stored in a `ref` (`onClickRef`) to avoid stale closures without re-running the effect
- Cleanup: `map.remove()` is called in the effect return function
- Coordinate snapping via `snapToGrid()` is applied before calling `onMapClick`

```typescript
map.on('click', (e) => {
  const features = map.queryRenderedFeatures(e.point, { layers: [LAYER_ID] });
  if (features.length === 0) {
    const snapped = snapToGrid(e.lngLat.lng, e.lngLat.lat);
    onClickRef.current(snapped);
  }
});
```

### `useFileIo()`

```typescript
const { importGeoJson, exportGeoJson } = useFileIo();

// Import — returns ImportResult with errors and summary
const result = await importGeoJson(file);

// Export — triggers browser download
exportGeoJson(collection(), 'my-pois.geojson');
```

Both functions are wrapped in `useCallback` with empty deps — stable references that won't cause unnecessary re-renders.

---

## Components

### `App.tsx`
- Root component coordinating layout and events
- Manages UI-only state: `showForm`, `pendingCoords`, `editingPoi`, `importResult`
- Calls `restore()` on mount via `useEffect`
- Syncs map with store via `useEffect`:
```tsx
useEffect(() => { updateData(collection()); }, [collection(), updateData]);
useEffect(() => { highlightPoi(selectedId); }, [selectedId, highlightPoi]);
```

### `Toolbar.tsx`
- File input (hidden, triggered by label) for GeoJSON import
- Merges imported features with existing: `[...collection().features, ...result.imported]`
- Undo/Redo buttons disabled via `canUndo()` / `canRedo()`

### `PoiList.tsx`
- Renders `filteredFeatures()` — updates automatically when store changes
- Local state `query` drives `setFilter({ query })`
- Click → `selectPoint()` + `flyTo()`
- Edit → calls `onEditRequest(poi)` prop (bubbles to App.tsx)
- Delete → `removePoint()` with `confirm()`

### `PoiForm.tsx`
- Controlled form with local `name` and `category` state
- `useEffect` on `[poi]` dependency resets form when switching between create/edit
- Validates on submit: name ≥ 2 chars, category selected
- Shows coordinates when in create mode

### `ImportReport.tsx`
- Pure presentational component
- Returns `null` when `result` prop is `null`
- Shows collapsible error list via `<details>`

---

## MapLibre Integration

MapLibre GL JS is a CommonJS module. In Vite, this requires special handling:

```typescript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@geo-editor/core': path.resolve(__dirname, '../../libs/core/src/index.ts'),
    },
  },
});
```

**Layer structure:**
```
GeoJSON Source (cluster: true, clusterMaxZoom: 14)
  ├── pois-cluster        ← colored circles for clusters (blue → purple → pink)
  ├── pois-cluster-count  ← abbreviated count label
  └── pois-layer          ← individual POI circles (blue, 8px radius)
```

**Why `preserveSymlinks` was NOT used:**
pnpm creates symlinks for workspace packages. An earlier attempt to use `preserveSymlinks: true` caused Rolldown to fail resolving `scheduler` (React internal). The solution was to rely on Vite's alias resolution directly to the TypeScript source.

---

## Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@geo-editor/core': path.resolve(__dirname, '../../libs/core/src/index.ts'),
    },
  },
});
```

**Why alias instead of pnpm workspace resolution?**
Vite resolves pnpm symlinks to their physical path before applying aliases. By pointing the alias directly to the TypeScript source, Vite transpiles the core in the same pipeline as the app — ensuring hot module replacement works and no compiled output is needed.

---

## How to Add a Feature

### Add a new store action

```typescript
// In poi.store.ts
interface PoiState {
  myNewAction: (param: string) => void;
}

// In create()
myNewAction: (param) => {
  // use applyCommand() if undoable, set() directly if not
  set({ ... });
}
```

### Add a new component

```tsx
// components/MyComponent.tsx
import { usePoiStore } from '../store/poi.store';

export function MyComponent() {
  const { features } = usePoiStore();
  return <div>{features().length} POIs</div>;
}
```

No provider needed — Zustand store is a module-level singleton.

---

## Build & Docker

```bash
# Development (Vite HMR)
cd apps/react-app && npx vite

# Production build
cd apps/react-app && npx vite build
# Output: apps/react-app/dist/

# Docker (from monorepo root)
docker compose build react-client --no-cache
```

The Dockerfile uses `npx vite build` directly (not `nx build react-app`) to bypass Nx cache issues in CI environments:

```dockerfile
WORKDIR /app/apps/react-app
RUN npx vite build
```

---

## Troubleshooting

### `n.features is undefined` (blank page)
**Cause:** Component calls `collection.features` but `collection` is a function in the Zustand store.
**Fix:** Call as function: `collection().features`.

### MapLibre map is blank / gray
**Cause:** Container has no height, or `useMapLibre` effect ran before the ref was attached.
**Fix:** Ensure the `ref` div has explicit height via CSS: `.app-layout__map { flex: 1; min-width: 0; }` and the parent is a flex container.

### `Cannot find module '@geo-editor/core'`
**Cause:** `tsconfig.app.json` has `paths` outside `compilerOptions`, or `vite.config.ts` alias is missing.
**Fix:**
```json
// tsconfig.app.json — paths must be INSIDE compilerOptions
{
  "compilerOptions": {
    "paths": { "@geo-editor/core": ["../../libs/core/src/index.ts"] }
  }
}
```

### Vite build fails: `Cannot resolve 'scheduler'`
**Cause:** `preserveSymlinks: true` was set in `vite.config.ts`, which breaks React's internal module resolution.
**Fix:** Remove `preserveSymlinks: true`. Use the `alias` approach instead.

### Imported POIs replace existing ones instead of merging
**Cause:** `loadCollection()` was called with only the imported features.
**Fix:** Merge with existing:
```typescript
loadCollection({
  type: 'FeatureCollection',
  features: [...collection().features, ...result.imported],
});
```

### Undo/Redo not working after page reload
**Cause:** `restore()` calls `initHistory(saved)` which resets `past[]` and `future[]`. This is by design — history is session-only.
**Expected behavior:** History is not persisted to localStorage, only the current `present` collection is.

### `pnpm-lock.yaml` out of date in Docker
**Cause:** Added a new dependency to `package.json` without running `pnpm install`.
**Fix:** Always run `pnpm install` from the monorepo root after changing any `package.json`, then commit the updated lock file.

### Hot reload not working for `@geo-editor/core` changes
**Cause:** Vite watches the aliased source path — if the core file is saved, Vite should HMR automatically.
**Fix:** If not working, restart the dev server. Ensure no `.vite` cache is stale: `rm -rf apps/react-app/node_modules/.vite`.
