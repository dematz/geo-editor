# 🔴 Angular App — Geo-Editor POI

> Part of the [`geo-editor`](../../README.md) monorepo.
> Framework: **Angular 18** · Architecture: **Standalone Components + Signals**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Services](#services)
5. [Components](#components)
6. [State Management with Signals](#state-management-with-signals)
7. [MapLibre Integration](#maplibre-integration)
8. [How to Add a Feature](#how-to-add-a-feature)
9. [Build & Docker](#build--docker)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
# From monorepo root
pnpm install
pnpm nx serve angular-app
# → http://localhost:4200
```

---

## Project Structure

```
apps/angular-app/src/
├── app/
│   ├── app.component.ts          ← Root standalone component — layout orchestrator
│   ├── app.component.html        ← Main layout: toolbar + map + sidebar
│   ├── app.component.scss        ← Global layout styles + design tokens
│   ├── app.module.ts             ← NgModule bootstrap entry (minimal)
│   │
│   ├── core/
│   │   └── services/
│   │       ├── poi.service.ts    ← POI state (Signals + HistoryState + Undo/Redo)
│   │       ├── map.service.ts    ← MapLibre wrapper (layers, clustering, flyTo, snap)
│   │       └── file-io.service.ts ← GeoJSON import (validate) + export (download)
│   │
│   ├── features/
│   │   ├── map/
│   │   │   └── map.component.ts  ← MapLibre canvas host, wires effects to services
│   │   ├── toolbar/
│   │   │   ├── toolbar.component.ts   ← Import / Export / Undo / Redo / Clear
│   │   │   └── toolbar.component.html
│   │   ├── poi-list/
│   │   │   ├── poi-list.component.ts  ← Sidebar list with search input
│   │   │   └── poi-list.component.html
│   │   └── poi-form/
│   │       ├── poi-form.component.ts  ← Reactive form for create/edit
│   │       └── poi-form.component.html
│   │
│   └── shared/
│       └── components/
│           └── import-report/
│               └── import-report.component.ts ← Import result banner
│
├── main.ts                       ← Bootstrap via AppModule
├── styles.scss                   ← MapLibre CSS import + global reset
└── index.html
```

---

## Architecture Overview

```
AppComponent (standalone, orchestrator)
    │
    ├── ToolbarComponent    ← import / export / undo / redo / clear
    ├── ImportReportComponent ← shows import summary banner
    ├── MapComponent        ← hosts MapLibre canvas, emits (mapClick)
    └── Sidebar
        ├── PoiListComponent  ← lists POIs, search, select, edit, delete
        └── PoiFormComponent  ← create (from map click) or edit POI
```

**Data flow:**
```
User clicks map
  → MapComponent emits (mapClick)
    → AppComponent.onMapClick() sets pendingCoords signal
      → PoiFormComponent appears
        → User fills form → (saved) event
          → AppComponent.onFormSaved()
            → PoiService.addPoint()
              → applyCommand() → HistoryState updated
                → collection signal changes
                  → MapComponent effect() → MapService.updateData()
                  → PoiListComponent renders new list
```

---

## Services

### `PoiService`

Central state manager using **Angular Signals**. All state is reactive — no manual subscriptions needed.

```typescript
// Signals (read-only outside service)
readonly collection       // computed(): current PoiFeatureCollection
readonly features         // computed(): PoiFeature[]
readonly filteredFeatures // computed(): filtered by search query
readonly selectedId       // signal: currently selected POI id
readonly canUndo          // computed(): boolean
readonly canRedo          // computed(): boolean
readonly loading          // signal: async restore in progress

// Actions
addPoint(coords, name, category)     // creates POI via Command
updatePoint(id, updates)             // updates via Command (undoable)
removePoint(id)                      // removes via Command (undoable)
loadCollection(collection)           // bulk load via Command (undoable)
selectPoint(id | null)               // UI selection (not undoable)
setFilter(opts)                      // search filter (not undoable)
undo()                               // steps back in history
redo()                               // steps forward in history
clearAll()                           // resets state + clears localStorage
restore()                            // loads from localStorage on init
```

### `MapService`

Wraps MapLibre GL JS. Keeps Angular outside MapLibre's rendering loop via `NgZone.runOutsideAngular()`.

```typescript
initMap(container, onMapClick)   // initializes map + layers + click handler
updateData(collection)           // updates GeoJSON source
flyTo(lng, lat)                  // animates map to coordinates
highlightPoi(id | null)          // changes circle color for selected POI
destroy()                        // removes map instance
```

**Coordinate snapping** is applied inside `initMap()` before emitting the click event:
```typescript
const snapped = snapToGrid(e.lngLat.lng, e.lngLat.lat); // 4 decimal places
this.zone.run(() => onMapClick(snapped));
```

### `FileIoService`

```typescript
importGeoJson(file: File): Promise<ImportResult>   // reads + validates
exportGeoJson(collection, filename?)               // triggers browser download
```

---

## Components

### `AppComponent`
- Root standalone component
- Orchestrates all UI state: `showForm`, `pendingCoords`, `editingPoi`, `importResult`
- Wires events between child components
- Calls `PoiService.restore()` on `ngOnInit`

### `MapComponent`
- Hosts the MapLibre `<div>` container via `@ViewChild`
- Initializes map in `ngAfterViewInit()`
- Uses `effect()` to reactively sync map with store:
```typescript
effect(() => this.mapService.updateData(this.poiService.collection()));
effect(() => this.mapService.highlightPoi(this.poiService.selectedId()));
```

### `ToolbarComponent`
- Import: triggers file input → `FileIoService.importGeoJson()` → emits `(importDone)`
- Export: calls `FileIoService.exportGeoJson()`
- Undo/Redo: calls `poiSvc.undo()` / `poiSvc.redo()`, disabled via `poiSvc.canUndo()` / `poiSvc.canRedo()`
- Clear: confirms then calls `poiSvc.clearAll()`

### `PoiListComponent` (standalone)
- Renders `poiSvc.filteredFeatures()` reactively
- Search input calls `poiSvc.setFilter({ query })`
- Select: calls `poiSvc.selectPoint()` + `mapSvc.flyTo()`
- Edit: emits `(editRequest)` to parent
- Delete: calls `poiSvc.removePoint()` with confirm dialog

### `PoiFormComponent` (standalone)
- Reactive form with `FormBuilder` + `Validators`
- `[poi]` input → edit mode (pre-fills form)
- `[coords]` input → create mode (shows coordinates)
- Emits `(saved)` with `{ name, category }` on valid submit

### `ImportReportComponent` (standalone)
- Displays `ImportResult` summary and error details
- Emits `(dismissed)` on close

---

## State Management with Signals

Angular Signals replace both NgRx and RxJS for local state. Key patterns used:

```typescript
// Writable signal
private readonly _history = signal<HistoryState>(initHistory(emptyCollection()));

// Computed signal (auto-updates when _history changes)
readonly canUndo = computed(() => canUndo(this._history()));

// Reading in template — no async pipe needed
{{ poiSvc.canUndo() }}

// Effect — runs when dependency signals change
effect(() => {
  this.mapService.updateData(this.poiService.collection());
});
```

**Why not RxJS here?**
- No async streams needed — all state is synchronous
- Signals have simpler mental model for component authors
- Better performance: only affected computed signals re-evaluate

---

## MapLibre Integration

MapLibre is initialized **outside Angular's zone** to prevent unnecessary change detection cycles:

```typescript
this.zone.runOutsideAngular(() => {
  this.map = new Map({ container, style: OSM_STYLE });
  this.map.on('click', (e) => {
    // Only zone.run() when we need Angular to react
    this.zone.run(() => onMapClick(snapped));
  });
});
```

**Layers setup:**
```
GeoJSON Source (cluster: true)
  ├── pois-cluster        ← colored circles for clusters
  ├── pois-cluster-count  ← count label inside cluster
  └── pois-layer          ← individual POI circles
```

**Budget configuration** (`angular.json`):
MapLibre GL JS is ~1.4MB. Angular's default 500KB budget is increased:
```json
"budgets": [
  { "type": "initial", "maximumWarning": "1mb", "maximumError": "2mb" }
]
```

---

## How to Add a Feature

### Add a new POI property (e.g. `description`)

1. **Core** — extend `PoiProperties` in `libs/core/src/domain/geojson.types.ts`
2. **Form** — add field to `PoiFormComponent` template and `FormBuilder`
3. **List** — display in `PoiListComponent` template
4. **No changes needed** to `PoiService`, `MapService`, or `LocalStorageRepository`

### Add a new map layer (e.g. heatmap)

1. Add layer in `MapService.setupSourceAndLayers()`
2. Add toggle signal in `MapService`
3. Wire toggle button in `ToolbarComponent`

---

## Build & Docker

```bash
# Development build
pnpm nx build angular-app

# Production build
pnpm nx build angular-app --configuration=production
# Output: apps/angular-app/dist/angular-app/browser/

# Docker (from monorepo root)
docker compose build angular-client --no-cache
```

The Dockerfile uses a **multi-stage build**:
- Stage 1 (builder): Node 20 Alpine → `pnpm install` → `nx build angular-app --configuration=production`
- Stage 2 (runtime): Nginx 1.25 Alpine serves `dist/angular-app/browser/`

---

## Troubleshooting

### `NG8001: 'app-xxx' is not a known element`
**Cause:** A standalone component is used in a template but not imported.
**Fix:** Add the component to the `imports[]` array of the consuming standalone component:
```typescript
@Component({
  standalone: true,
  imports: [MyNewComponent], // ← add here
})
```

### `'imports' is only valid on a component that is standalone`
**Cause:** `imports[]` array used without `standalone: true`.
**Fix:** Add `standalone: true` to the `@Component` decorator.

### MapLibre map not rendering (blank gray area)
**Cause:** Container has no height, or `initMap()` called before DOM is ready.
**Fix:** Ensure `ngAfterViewInit()` (not `ngOnInit()`) initializes the map, and the container has explicit `height: 100%`.

### `NX Invalid Cache Directory` on Docker build
**Cause:** Nx cache from a different machine is copied into the Docker context.
**Fix:** Add `.nx/cache` and `.nx/workspace-data` to `.dockerignore`.

### Angular budget exceeded error
**Cause:** MapLibre GL JS exceeds Angular's default 500KB initial bundle budget.
**Fix:** Increase budgets in `angular.json`:
```json
{ "type": "initial", "maximumWarning": "1mb", "maximumError": "2mb" }
```

### `Cannot read properties of undefined (reading 'features')`
**Cause:** A component reads `collection.features` but `collection` is now a function (Signal computed).
**Fix:** Call it as a function: `collection().features`.

### Signals `effect()` not triggering
**Cause:** `effect()` called outside an injection context (e.g. inside `setTimeout`).
**Fix:** Always call `effect()` inside the constructor or `ngAfterViewInit()`, or pass `{ injector }` option.

### `pnpm install --frozen-lockfile` fails in Docker
**Cause:** `package.json` was modified but `pnpm-lock.yaml` was not regenerated.
**Fix:** Run `pnpm install` locally before committing, then rebuild Docker.
