# 🔴 Angular App — Geo-Editor POI

> Part of the [`geo-editor`](../../README.md) monorepo.
> Framework: **Angular 18** · Architecture: **Standalone Components + Signals + @geo-editor/ui-angular**

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Architecture Overview](#architecture-overview)
4. [Design System Integration](#design-system-integration)
5. [Services](#services)
6. [State Management with Signals](#state-management-with-signals)
7. [MapLibre Integration](#maplibre-integration)
8. [Description Field](#description-field)
9. [Build & Docker](#build--docker)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

```bash
pnpm install
pnpm nx serve angular-app
# → http://localhost:4200
```

---

## Project Structure

```
apps/angular-app/src/
├── app/
│   ├── app.component.ts          ← Root standalone — layout + event orchestration
│   ├── app.component.html        ← DsTopBar + DsSidebar + AppMap + DsPoiFormModal
│   ├── app.component.scss        ← App shell layout only (.app-shell, .app-body, .app-map)
│   ├── app.module.ts             ← Minimal NgModule bootstrap entry
│   │
│   ├── core/services/
│   │   ├── poi.service.ts        ← POI state (Signals + HistoryState + description support)
│   │   ├── map.service.ts        ← MapLibre wrapper (pendingCollection buffer, snap)
│   │   └── file-io.service.ts    ← GeoJSON import/export
│   │
│   ├── features/map/
│   │   └── map.component.ts      ← MapLibre host — effect() in constructor
│   │
│   ├── shared/components/
│   │   └── import-report/        ← Import result banner (uses DS tokens inline)
│   │
│   └── utils/
│       └── category-map.ts       ← Maps core category strings → CategoryId + SIDEBAR_CATEGORIES
│
├── main.ts
├── styles.scss                   ← MapLibre CSS + DS body tokens (no hardcoded values)
└── index.html
```

**Note:** `features/toolbar/`, `features/poi-list/`, `features/poi-form/`, and `app-routing.module.ts` were removed — fully replaced by `@geo-editor/ui-angular` DS components.

---

## Architecture Overview

```
AppComponent (standalone, orchestrator)
    │
    ├── DsTopBarComponent     ← search, undo/redo, import, export, clear, avatar
    ├── ImportReportComponent ← import result banner (DS tokens, no external classes)
    ├── MapComponent          ← MapLibre canvas, emits (mapClick)
    ├── DsSidebarComponent    ← POI list, categories, New POI button, collapse toggle
    └── DsPoiFormModalComponent ← create / edit form (name, category, description, coords)
```

**Data flow — create POI:**
```
User clicks map
  → MapComponent (effect in constructor) emits (mapClick) output
    → AppComponent.onMapClick() sets pendingCoords signal
      → DsPoiFormModal opens with lat/lng pre-filled
        → User fills name, category, description → save
          → AppComponent.onModalSave()
            → PoiService.addPoint(coords, name, category, description)
              → addPoiCommand() → applyCommand() → HistoryState updated
                → collection signal changes
                  → MapService.updateData() via effect()
                  → DsSidebarComponent renders updated list
```

---

## Design System Integration

The Angular app consumes two DS packages:

```typescript
// angular.json — styles array (order matters)
"styles": [
  "../../libs/design-tokens/src/index.css",  // ← tokens first
  "src/styles.scss"                           // ← app overrides after
]

// tsconfig.json — path aliases
"paths": {
  "@geo-editor/ui-angular": ["../../libs/design-system-angular/src/index.ts"],
  "@geo-editor/tokens":     ["../../libs/design-tokens/src/index.css"],
  "@geo-editor/core":       ["../../libs/core/src/index.ts"]
}
```

### Component usage in AppComponent

```typescript
imports: [
  MapComponent,
  ImportReportComponent,
  DsTopBarComponent,        // ← @geo-editor/ui-angular
  DsSidebarComponent,       // ← @geo-editor/ui-angular
  DsPoiFormModalComponent,  // ← @geo-editor/ui-angular
]
```

### ViewEncapsulation.None — CSS selector rules

All DS components use `ViewEncapsulation.None` — there is no shadow DOM. This has two important consequences:

**1. `:host` selectors have no effect.** Use direct element selectors instead:
```css
/* ❌ Does not work */
:host ds-button.newBtn { width: 100%; }

/* ✅ Correct — target the rendered host element and its inner .button */
.newBtnWrapper ds-button { display: flex; width: 100%; }
.newBtnWrapper ds-button .button { width: 100%; justify-content: center; }
```

**2. Styles are global.** DS component CSS classes (`.button`, `.input`, `.select`) are available anywhere in the document. Use parent context selectors to scope overrides:
```css
/* Override button colors only inside the topbar context */
.actionsGroup ds-button .button { color: var(--ds-topbar-fg); }
```

### category-map.ts — bridging core ↔ DS

Core uses a wider set of category strings (`landmark`, `cafe`, `museum`, `transport`, etc.) while the DS `CategoryId` is limited to `restaurant | hotel | park | hospital | custom`. The mapping is handled in `utils/category-map.ts`:

```typescript
export function toCategoryId(raw: string): CategoryId {
  return RAW_TO_CAT[raw?.toLowerCase()] ?? 'custom';
}
```

**Pending refactor:** `CategoryId` should be moved to `libs/core/src/domain/` to eliminate duplication between `ui-react` and `ui-angular`.

---

## Services

### `PoiService`

```typescript
// Signals
readonly collection       // computed(): PoiFeatureCollection
readonly features         // computed(): PoiFeature[]
readonly filteredFeatures // computed(): filtered by search
readonly selectedId       // signal: selected POI id
readonly canUndo          // computed(): boolean
readonly canRedo          // computed(): boolean
readonly loading          // signal: restore in progress

// Actions — all mutations go through applyCommand() for undo/redo
addPoint(coords, name, category, description?)  // ← description optional
updatePoint(id, { name?, category?, description? })
removePoint(id)
loadCollection(collection)
selectPoint(id | null)
setFilter({ query?, categories? })
undo() / redo()
clearAll()
restore()                 // loads from localStorage on init
```

### `MapService`

```typescript
initMap(container, onMapClick)  // sets up layers, snap, pendingCollection buffer
updateData(collection)          // safe to call before load — buffered internally
flyTo(lng, lat)
highlightPoi(id | null)
destroy()
```

**`pendingCollection` buffer pattern:**
```typescript
// If map hasn't loaded yet, store data for later flush
updateData(collection: PoiFeatureCollection): void {
  if (!this.styleLoaded) {
    this.pendingCollection = collection;  // buffer
    return;
  }
  // ... setData on source
}

// On load, flush pending data
private setupSourceAndLayers(): void {
  // ... add source and layers
  this.styleLoaded = true;
  if (this.pendingCollection) {
    this.updateData(this.pendingCollection);
    this.pendingCollection = null;
  }
}
```

---

## State Management with Signals

### Critical rule — `effect()` must be in the constructor

```typescript
// ❌ WRONG — effect() called outside injection context
export class MapComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    this.mapService.initMap(...);
    effect(() => { ... }); // silently fails — never registers
  }
}

// ✅ CORRECT — effect() in constructor
export class MapComponent implements AfterViewInit {
  constructor() {
    effect(() => {
      this.mapService.updateData(this.poiService.collection());
    });
    effect(() => {
      this.mapService.highlightPoi(this.poiService.selectedId());
    });
  }

  ngAfterViewInit(): void {
    this.mapService.initMap(...); // map init still here
  }
}
```

**Why:** Angular's `effect()` requires an active injection context to register the reactive dependency. The constructor runs inside the injection context; `ngAfterViewInit` does not.

---

## MapLibre Integration

Map initialization runs **outside Angular's zone** to prevent unnecessary change detection cycles:

```typescript
this.zone.runOutsideAngular(() => {
  this.map = new Map({ container, style: OSM_STYLE });

  this.map.on('click', (e) => {
    const snapped = snapToGrid(e.lngLat.lng, e.lngLat.lat);
    this.zone.run(() => onMapClick(snapped)); // re-enter zone for Angular reactivity
  });
});
```

**Layer stack:**
```
GeoJSON Source (cluster: true, clusterMaxZoom: 14)
  ├── pois-cluster        ← cluster circles (blue → purple → pink by count)
  ├── pois-cluster-count  ← abbreviated count label
  └── pois-layer          ← individual POI circles (8px, blue, white stroke)
```

---

## Description Field

The `description` optional field flows through the entire stack:

```
DsPoiFormModal (textarea bound via [(ngModel)])
  → AppComponent.onModalSave(data: PoiFormData)
    → PoiService.addPoint(coords, name, category, data.description)
      → addPoiCommand(coords, name, category, description)
        → createPoi(coords, name, category, { description })
          → stored in PoiFeature.properties.description
            → JSON.stringify in LocalStorageRepository → persisted
```

On edit, `modalInitialData` computed signal reads `editingPoi.properties['description']`:
```typescript
const desc = editingPoi.properties['description'];
description: typeof desc === 'string' ? desc : '',
```

Undo/Redo captures `description` in both `prev` and `next` snapshots inside `updatePoiCommand`.

---

## Build & Docker

```bash
# Development
pnpm nx serve angular-app

# Production
pnpm nx build angular-app --configuration=production
# Output: apps/angular-app/dist/angular-app/browser/

# Docker
docker compose build angular-client --no-cache
```

**Dockerfile key points:**
- Copies `libs/design-tokens`, `libs/design-system-angular` into build context
- Runs `pnpm nx reset` before build to clear stale project graph cache
- `libs/design-system-angular/tsconfig.json` extends `../../tsconfig.json` (root) — root `tsconfig.json` must exist in Docker context

---

## Troubleshooting

### POI markers not visible on map after load
**Cause:** `effect()` was registered in `ngAfterViewInit` instead of the constructor — it silently failed, so `updateData()` was never called reactively.
**Fix:** Move all `effect()` calls to the `constructor()`.

### POI markers visible initially but disappear after restore
**Cause:** `updateData()` was called before `map.on('load')` fired. The guard `if (!styleLoaded) return` discarded the data silently.
**Fix:** `MapService` now buffers data in `pendingCollection` and flushes on load.

### `Failed to process project graph` in Docker
**Cause:** Nx cannot find `tsconfig.json` referenced by `libs/design-system-angular/tsconfig.json`.
**Fix:** Ensure root `tsconfig.json` is copied in the Dockerfile AND `pnpm nx reset` runs before the build.

### `NG8001: 'ds-xxx' is not a known element`
**Cause:** DS component not added to `imports[]` of the consuming standalone component.
**Fix:** Add the component to `imports: [DsTopBarComponent, ...]` in `@Component`.

### `imports` array error without `standalone: true`
**Fix:** Add `standalone: true` to the `@Component` decorator before using `imports[]`.

### Buttons invisible in TopBar
**Cause:** CSS used `:host ds-button .button` which has no effect with `ViewEncapsulation.None`.
**Fix:** Use `.actionsGroup ds-button .button` — target from nearest ancestor class context.

### New POI button not full width
**Cause:** `:host ds-button.newBtn { width: 100% }` has no effect without shadow DOM.
**Fix:** `.newBtnWrapper ds-button { display: flex; width: 100%; }` + `.newBtnWrapper ds-button .button { width: 100%; }`.

### Categories section not at sidebar bottom
**Cause:** `.inner { height: 100% }` collapses in a flex column without `flex: 1` and `min-height: 0` on the scrollable child.
**Fix:** `.inner { flex: 1; min-height: 0; }` + `.list { flex: 1; min-height: 0; }` + `.categories { flex-shrink: 0; }`.

### `pnpm install --frozen-lockfile` fails in Docker
**Cause:** `package.json` changed but `pnpm-lock.yaml` not regenerated.
**Fix:** Run `pnpm install` locally from monorepo root, commit the updated lockfile.
