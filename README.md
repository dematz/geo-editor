# 🗺️ Advanced Geo-Editor POI

> **Author:** Dennis Mauricio Martinez Suarez — Lead Frontend Developer
> **Stack:** Angular 18 · React 19 · TypeScript 5 · MapLibre GL JS · Nx Monorepo · pnpm workspaces · CSS-first Design System

A production-ready Point of Interest (POI) editor built with a **framework-agnostic core architecture**, dual-framework UI (Angular + React), a shared CSS-first design system, AI-powered import validation, Command-pattern Undo/Redo, and full Docker support.

---

## 📚 Documentation

| Module | README |
|---|---|
| 🌐 **This file** — Global architecture, quick start, ADRs | `README.md` |
| 🔴 **Angular App** — Signals, DS integration, MapLibre buffering, troubleshooting | [`apps/angular-app/README.md`](apps/angular-app/README.md) |
| 🔵 **React App** — Zustand, DS integration, Vite alias, troubleshooting | [`apps/react-app/README.md`](apps/react-app/README.md) |
| ⚙️ **Core Library** — Domain types, use-cases, validators, history, pending refactors | [`libs/core/README.md`](libs/core/README.md) |
| 📋 **Changelog** — Bugs fixed, features added, technical analysis | [`CHANGELOG.md`](CHANGELOG.md) |

---

## 📋 Requirements

| Tool | Version | Purpose |
|---|---|---|
| Node | 20 LTS | Runtime |
| pnpm | 9+ | Package manager |
| Angular CLI | 18+ | Angular dev server |
| Docker | 24+ | Containerized deployment (optional) |

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <repo-url> && cd geo-editor
pnpm install

# 2. Run Angular app  →  http://localhost:4200
pnpm nx serve angular-app

# 3. Run React app    →  http://localhost:3000
pnpm nx serve react-app
```

### With Docker

```bash
docker compose up --build
# Angular → http://localhost:4200
# React   → http://localhost:3001
```

---

## 🏗️ Monorepo Structure

```
geo-editor/
├── apps/
│   ├── angular-app/              ← Angular 18 (standalone + Signals + @geo-editor/ui-angular)
│   └── react-app/                ← React 19 (Zustand + Vite + @geo-editor/ui-react)
│
├── libs/
│   ├── core/                     ← Framework-agnostic business logic (TypeScript only)
│   │   └── src/
│   │       ├── domain/           ← PoiFeature, LngLat, PoiProperties (incl. description?)
│   │       ├── use-cases/
│   │       │   ├── validators/   ← GeoJSON validation + AI Smart Fixer (inline, pre-validation)
│   │       │   ├── history/      ← Command pattern (Undo/Redo, 50 steps, description support)
│   │       │   ├── search/       ← POI filter by name and category
│   │       │   └── snap/         ← Grid snapping for map clicks (4 decimal default)
│   │       └── infrastructure/   ← LocalStoragePoiRepository
│   │
│   ├── design-tokens/            ← @geo-editor/tokens — CSS custom properties (--ds-*)
│   │   └── src/
│   │       ├── tokens/           ← colors (oklch), typography (Inter), spacing (4px base), animations
│   │       └── styles/           ← reset, utilities, maplibre overrides
│   │
│   ├── design-system-react/      ← @geo-editor/ui-react — React components + CSS Modules + Storybook
│   │   └── src/components/       ← Button, Input, Select, Textarea, Label, CategoryChip,
│   │                                POIItem, TopBar, Sidebar, POIFormModal
│   │
│   └── design-system-angular/    ← @geo-editor/ui-angular — Angular standalone + ViewEncapsulation.None
│       └── src/components/       ← DsButton, DsInput, DsSelect, DsTextarea, DsLabel,
│                                    DsCategoryChip, DsPoiItem, DsTopBar, DsSidebar,
│                                    DsPoiFormModal, DsIcon (inline SVG, no external dep)
│
├── CHANGELOG.md                  ← Technical changelog with bug analysis and refactor recommendations
├── docker-compose.yml
├── lighthouserc.yml
├── nx.json
└── pnpm-workspace.yaml
```

---

## ✨ Feature Overview

### Core MVP
| Feature | Description |
|---|---|
| 🗺️ Map | MapLibre GL JS + OSM tiles — no API key required, attribution visible |
| 📂 Import GeoJSON | Validates, reports errors per-feature, AI Smart Fixer auto-corrects where possible |
| 📍 Create POIs | Click map → modal with name, category, description, coordinates pre-filled |
| ✏️ Edit / Delete | Full CRUD via modal form — description restored on edit |
| 📝 Description field | Optional free-text, persisted to localStorage, restored on edit, tracked in undo/redo |
| 💾 Persistence | Auto-saved to `localStorage` key `poi_editor_state`, restored on load |
| 📤 Export | Download current state as `.geojson` |
| 🔍 Search | Real-time filter by name in the sidebar list |
| 🔵 Clustering | Native MapLibre cluster layers (auto at zoom < 14) |

### Advanced Features
| Feature | Description |
|---|---|
| ↩ Undo / Redo | Command pattern, 50-step history — all mutations including description edits |
| 🤖 AI Smart Fixer | Runs inline during validation — infers missing categories, repairs swapped lat/lon |
| 📊 Import report | Detailed banner: imported/discarded counts with per-reason breakdown + AI fixes applied |
| 📐 Grid snapping | Map clicks snapped to 4-decimal grid (~11m precision), configurable |
| 🎨 Design System | Shared token-based UI — same visual language across Angular and React |

---

## 🎨 Design System Architecture

```
@geo-editor/tokens          ← Layer 1: CSS custom properties only (--ds-*)
         ↓
@geo-editor/ui-react        ← Layer 2a: React components (CSS Modules + tokens)
@geo-editor/ui-angular      ← Layer 2b: Angular standalone (ViewEncapsulation.None + tokens)
         ↓
apps/react-app              ← Layer 3: Consuming DS components
apps/angular-app            ← Layer 3: Consuming DS components
```

### Token categories

| Group | Example tokens | Purpose |
|---|---|---|
| Colors | `--ds-primary`, `--ds-foreground`, `--ds-topbar`, `--ds-cat-restaurant` | Brand, semantic, POI categories |
| Typography | `--ds-font-sans` (Inter), `--ds-text-base` (14px) | Font, size scale (1.2 ratio), weights, tracking |
| Spacing | `--ds-space-4` (16px) | 4px base grid, 16 steps |
| Radius | `--ds-radius-md` (8px), `--ds-radius-full` | Border radius scale |
| Shadows | `--ds-shadow-modal`, `--ds-shadow-topbar` | Elevation system |
| Z-index | `--ds-z-topbar` (30), `--ds-z-modal` (50) | Deterministic stacking order |
| Transitions | `--ds-duration-fast` (100ms), `--ds-ease-out` | Animation timing |
| Components | `--ds-topbar-height` (56px), `--ds-sidebar-width` (280px) | Domain-specific dimensions |
| Dark mode | `.dark` class on `<html>` | Full theme override via same token names |

### Design System — Angular-specific rules

All Angular DS components use `ViewEncapsulation.None` — no shadow DOM. This requires different CSS selector patterns:

```css
/* ❌ No effect without shadow DOM */
:host ds-button.newBtn { width: 100%; }

/* ✅ Target from nearest ancestor class, then inner .button */
.newBtnWrapper ds-button { display: flex; width: 100%; }
.newBtnWrapper ds-button .button { width: 100%; justify-content: center; }
```

`DsInputComponent`, `DsSelectComponent`, `DsTextareaComponent` implement Angular's `ControlValueAccessor` — compatible with `[(ngModel)]` and `formControlName` out of the box.

`DsIconComponent` renders SVG inline — zero external icon library dependency, eliminating ~50KB from the bundle.

### Design System — Build strategy

Tokens and UI libs are processed **at build time**, not mounted as runtime volumes:

```dockerfile
# Angular Dockerfile — only what Angular needs
COPY libs/design-tokens          ./libs/design-tokens
COPY libs/design-system-angular  ./libs/design-system-angular

# React Dockerfile — only what React needs
COPY libs/design-tokens          ./libs/design-tokens
COPY libs/design-system-react    ./libs/design-system-react
```

CSS from tokens ends up inlined in each app's final bundle. Nginx serves pure static files with no knowledge that a design system existed.

---

## 🏛️ Architecture Decision Records (ADR)

### ADR-1 — Nx Monorepo with pnpm workspaces
Angular and React share `@geo-editor/core` without code duplication. Nx handles build graph, caching, and affected project detection. pnpm workspaces resolve cross-package symlinks.

**Trade-off:** In Docker, Nx project graph requires all `tsconfig.json` files referenced via `extends` to be present in the build context. Missing files cause `Failed to process project graph`. Fix: run `pnpm nx reset` in Dockerfile before build, and ensure root `tsconfig.json` is copied.

### ADR-2 — Framework-agnostic Core (`libs/core`)
Zero framework dependencies — pure TypeScript. All business logic (validation, CRUD, undo/redo, AI fixer, snapping, description field) is tested independently from any UI framework.

**Trade-off:** Requires a thin adapter layer in each app (service in Angular, store in React). Type widening at the boundary (`string` in core → `CategoryId` union in DS) is handled by `categoryMap.ts` in each app.

### ADR-3 — CSS-First Design Tokens (no JS tokens)
Tokens are CSS custom properties only — no JavaScript token objects, no runtime theme provider. Both frameworks consume the same `index.css`. Dark mode via `.dark` class on `<html>`.

**Trade-off:** No TypeScript-level type-safety on token names. Convention enforced by code review, not compiler.

### ADR-4 — Separate DS libs per framework (`ui-react` / `ui-angular`)
A single combined lib risks cross-framework imports and complicates the Nx build graph. Separate libs allow independent Storybook instances, isolated bundle analysis, and guarantee Angular's bundle never includes React code.

**Trade-off:** Component API must be kept in sync manually between both libs. Addressed by the `CategoryId` centralization pending refactor.

### ADR-5 — Angular Signals + `effect()` in constructor
`PoiService` uses `signal()` and `computed()` for all reactive state. `MapComponent` registers `effect()` calls in the **constructor**, not in `ngAfterViewInit`.

**Critical:** `effect()` requires an active injection context. Calling it in `ngAfterViewInit` silently fails — the effect is never registered and map updates stop working. This was the root cause of the POI markers not rendering bug.

### ADR-6 — Zustand `history` as `useEffect` dependency
The Zustand store exposes `collection`, `features`, `filteredFeatures` as plain functions with stable references. `useEffect` must depend on `history` (the raw state object) — not `collection()` — to re-run on state mutations.

**Root cause of React markers bug:** `useEffect([collection, updateData])` never re-ran because `collection` is a stable function reference. Fix: `useEffect([history, updateData])`.

### ADR-7 — MapLibre data buffering pattern
MapLibre's `source.setData()` can only be called after the `load` event fires. Both apps implement a buffer:

- **React (`useMapLibre`):** `pendingDataRef` — stores the latest collection if called before load; flushed inside `map.on('load')`
- **Angular (`MapService`):** `pendingCollection` property — same pattern, flushed in `setupSourceAndLayers()`

Without this, POI markers from `restore()` or initial state silently disappear — `setData()` is called before the source exists.

### ADR-8 — Command Pattern for Undo/Redo with description support
Each mutation is a `Command` with `execute()` and `undo()`. The `description` field is captured in both `prev` and `next` snapshots inside `updatePoiCommand` — undoing a description edit correctly restores the prior value. History capped at 50 steps.

### ADR-9 — `IPoiRepository` — storage-agnostic interface
`LocalStoragePoiRepository` serializes the full `FeatureCollection` via `JSON.stringify`. Adding the `description` field required **zero changes** to the repository — the interface is property-agnostic by design.

**Migration path:** Replace with `HttpPoiRepository` implementing the same 3-method interface — zero changes to use-cases, services, or UI.

### ADR-10 — Grid Snapping (4 decimal places, ~11m)
Map click coordinates are rounded to 4 decimal places before storage. Configurable via `SnapOptions.precision`. Applied in both `MapService` (Angular) and `useMapLibre` (React).

---

## 🧪 Testing

```bash
cd libs/core && pnpm vitest run --coverage
```

```
Test Files : 7 passed
Tests      : 71 passed
Coverage   : 96.46% statements
             95.09% branches
             91.66% functions
             (infrastructure/ excluded — requires browser localStorage API)
```

---

## 🐳 Docker

```bash
docker compose build --no-cache   # full rebuild
docker compose up -d              # start detached
docker compose down               # stop
docker compose build angular-client --no-cache  # rebuild single service
```

**Angular Dockerfile notes:**
- Runs `pnpm nx reset` before build — clears stale project graph cache from host machine
- Root `tsconfig.json` must be present — referenced by `libs/design-system-angular/tsconfig.json` via `"extends": "../../tsconfig.json"`
- Copies `libs/design-tokens` + `libs/design-system-angular` into build context

**React Dockerfile notes:**
- Uses `npx vite build` directly (not `nx build react-app`) — bypasses Nx cache issues in CI
- Copies `libs/design-tokens` + `libs/design-system-react` into build context

---

## 🔦 Lighthouse CI

```bash
npm install -g @lhci/cli
lhci autorun
# Reports → ./lighthouse-results/
```

| Metric | Local Docker | Threshold |
|---|---|---|
| First Contentful Paint | ~4.4s | warn > 3s |
| Time to Interactive | ~5s | warn > 6s |
| Accessibility | ✅ pass | > 0.8 |
| Best Practices | ✅ pass | > 0.8 |

FCP is above threshold in local Docker — MapLibre GL JS bundle (~1.4MB) + no CDN/HTTP2/compression. Production deployment with CDN reduces FCP to ~1s.

---

## ⚠️ Known Limitations & Future Improvements

- **Point-only geometry** — only `Point` features are supported. Lines/Polygons require extending `PoiFeature` with union types and adding new MapLibre paint layers
- **Single-user** — localStorage has no sync. Multi-user requires `HttpPoiRepository` implementing `IPoiRepository`
- **`CategoryId` duplication** — type defined in both `@geo-editor/ui-react` and `@geo-editor/ui-angular`. Recommended refactor: move to `libs/core/src/domain/category.types.ts` as single source of truth. See `libs/core/README.md#pending-refactors`
- **AI Smart Fixer ambiguity** — coordinates where both values fit `[-90, 90]` (e.g. Colombian `[-74, 4.7]`) cannot be auto-detected as swapped without geographic context
- **Bundle size** — MapLibre adds ~1.4MB initial; dynamic import or splitting would reduce first load
- **Accessibility** — ARIA labels present on all DS interactive components; full WCAG 2.1 AA audit pending

---

## 📬 Contact

Challenge contact: jorge@mapvx.com
**Dennis Mauricio Martinez Suarez · Lead Frontend Developer**
