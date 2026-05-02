# 🗺️ Advanced Geo-Editor POI

> **Author:** Dennis Mauricio Martinez Suarez — Lead Frontend Developer
> **Stack:** Angular 18 · React 19 · TypeScript 5 · MapLibre GL JS · Nx Monorepo · pnpm workspaces

A production-ready Point of Interest (POI) editor built with a **framework-agnostic core architecture**, dual-framework UI (Angular + React), AI-powered import validation, Command-pattern Undo/Redo, and full Docker support.

---

## 📚 Documentation

| Module | README |
|---|---|
| 🌐 **This file** — Global architecture, quick start, ADRs | `README.md` |
| 🔴 **Angular App** — Signals, services, standalone components | [`apps/angular-app/README.md`](apps/angular-app/README.md) |
| 🔵 **React App** — Zustand store, hooks, Vite | [`apps/react-app/README.md`](apps/react-app/README.md) |
| ⚙️ **Core Library** — Domain types, use-cases, validators | [`libs/core/README.md`](libs/core/README.md) |

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
# Build and start both apps
docker compose up --build

# Angular → http://localhost:4200
# React   → http://localhost:3001
```

---

## 🏗️ Monorepo Structure

```
geo-editor/
├── apps/
│   ├── angular-app/          ← Angular 18 (standalone components + Signals)
│   └── react-app/            ← React 19 (Zustand + Vite)
├── libs/
│   └── core/                 ← Framework-agnostic business logic (TypeScript only)
│       └── src/
│           ├── domain/       ← Interfaces: PoiFeature, LngLat, IPoiRepository
│           ├── use-cases/
│           │   ├── validators/      ← GeoJSON validation engine
│           │   ├── ai-smart-fixer/  ← Category inference + coordinate repair
│           │   ├── history/         ← Command pattern (Undo/Redo, 50 steps)
│           │   ├── search/          ← POI filter by name and category
│           │   └── snap/            ← Grid snapping for map clicks
│           └── infrastructure/      ← LocalStoragePoiRepository
├── docker-compose.yml
├── lighthouserc.yml
├── nx.json
├── pnpm-workspace.yaml
└── README.md
```

---

## ✨ Feature Overview

### Core MVP
| Feature | Description |
|---|---|
| 🗺️ Map base | MapLibre GL JS with OpenStreetMap tiles — no API key required |
| 📂 Import GeoJSON | Validates, reports errors, imports only valid Point features |
| 📍 Create POIs | Click anywhere on the map to place a point |
| ✏️ Edit / Delete | Inline form with name, category fields and delete confirmation |
| 💾 Persistence | Auto-saved to `localStorage` key `poi_editor_state`, restored on load |
| 📤 Export | Download current state as `.geojson` file |
| 🔍 Search | Real-time filter by name in the sidebar list |
| 🔵 Clustering | Native MapLibre cluster layers for dense datasets |

### Advanced Features
| Feature | Description |
|---|---|
| ↩ Undo / Redo | Command pattern with 50-step history across all mutations |
| 🤖 AI Smart Fixer | Auto-infers missing categories from POI names; repairs swapped lat/lon |
| 📊 Import report | Detailed banner: imported count, discarded count with reasons, AI fixes applied |
| 📐 Grid snapping | Map click coordinates snapped to 4-decimal grid (~11m precision) |

---

## 🏛️ Architecture Decision Records (ADR)

### ADR-1 — Nx Monorepo with pnpm workspaces
Angular and React share `@geo-editor/core` without any code duplication. Each app imports domain types, validators, and use-cases from the same TypeScript source. pnpm workspaces handle cross-package symlinks automatically.

**Trade-off:** Slightly more complex initial setup vs. maintaining two separate repos that diverge over time.

### ADR-2 — Framework-agnostic Core (`libs/core`)
`libs/core` has zero framework dependencies — pure TypeScript with no imports of Angular, React, or any UI library. All business logic (validation, CRUD, undo/redo, AI fixer, snapping) is tested independently.

**Trade-off:** Requires a thin adapter layer in each app (service in Angular, store in React) but enables complete reuse and framework-independent testing.

### ADR-3 — Angular Signals (no NgRx)
Angular 18 Signals provide fine-grained reactivity without Zone.js overhead. `PoiService` exposes `computed()` signals for `collection`, `filteredFeatures`, `canUndo`, and `canRedo`. The template reacts automatically with zero manual subscriptions or `async` pipes.

**Trade-off:** Signals are a newer API (Angular 17+). Team members familiar only with RxJS/NgRx will need a learning curve.

### ADR-4 — Zustand (no Redux/Recoil)
React state is managed with Zustand — minimal boilerplate, no provider wrapping, computed values as plain functions. The store mirrors `PoiService` from Angular, making cross-framework feature parity easy to maintain.

**Trade-off:** Zustand's lack of strict immutability enforcement requires discipline. Immer middleware can be added if needed.

### ADR-5 — MapLibre GL JS
Open-source fork of Mapbox GL JS with no API key, no usage limits, and no vendor lock-in. OSM raster tiles serve as the base layer. Clustering is handled natively via `cluster: true` on the GeoJSON source.

**Trade-off:** MapLibre is a CommonJS module which causes Vite/Rolldown warnings. Mitigated via `allowedCommonJsDependencies` in Angular and `optimizeDeps` in Vite.

### ADR-6 — Command Pattern for Undo/Redo
Each mutation (add, update, remove, load) is a `Command` object with `execute()` and `undo()` methods. `HistoryState` holds `past[]`, `present`, and `future[]` — a pure functional implementation with no side effects. History is capped at 50 steps to bound memory usage.

**Trade-off:** Slightly more verbose than simple state snapshots, but enables precise undo semantics per operation type.

### ADR-7 — localStorage as Repository via Interface
`IPoiRepository` decouples storage from business logic. The current implementation (`LocalStoragePoiRepository`) satisfies the MVP. Migrating to HTTP API requires only a new class implementing the same 3-method interface — zero changes to use-cases or UI layers.

**Trade-off:** localStorage has a ~5MB limit and is synchronous. For large datasets, IndexedDB or a backend would be needed.

### ADR-8 — AI Smart Fixer (offline, no LLM API)
Category inference uses regex pattern matching against 11 category rules. Coordinate repair detects swapped `[lat, lon]` by checking range heuristics. No external API calls, no latency, no cost.

**Trade-off:** Pattern matching cannot handle ambiguous or multilingual POI names. Upgrading to an LLM API requires only replacing `inferCategory()` with an async function.

### ADR-9 — Grid Snapping (4 decimal places)
Map click coordinates are rounded to 4 decimal places (~11m precision at the equator). This produces clean, reproducible coordinates aligned to an implicit grid.

**Trade-off:** Sub-11m precision is lost. Configurable via `SnapOptions.precision` if higher precision is needed.

---

## 🧪 Testing

```bash
# Run all tests once
cd libs/core && pnpm vitest run

# Run with coverage report
cd libs/core && pnpm vitest run --coverage

# Watch mode (development)
cd libs/core && pnpm vitest
```

### Coverage Summary

```
Test Files : 7 passed
Tests      : 71 passed

File                        | Stmts  | Branch | Funcs  |
----------------------------|--------|--------|--------|
poi.use-cases.ts            | 100%   | 100%   | 100%   |
geojson.validator.ts        |  90%   |  88%   | 100%   |
category-inference.ts       | 100%   | 100%   | 100%   |
coordinate-repair.ts        | 100%   | 100%   | 100%   |
smart-fixer.ts              | 100%   | 100%   | 100%   |
command.types.ts            | 100%   | 100%   | 100%   |
poi.commands.ts             | 100%   | 100%   | 100%   |
poi-filter.ts               | 100%   | 100%   | 100%   |
snap.ts                     | 100%   | 100%   | 100%   |
----------------------------|--------|--------|--------|
Overall                     |  96%   |  95%   |  91%   |
```

> `infrastructure/` (LocalStoragePoiRepository) is excluded from coverage — it requires browser `localStorage` API not available in Node.js test environment.

---

## 🐳 Docker

```bash
# Build both images
docker compose build --no-cache

# Start detached
docker compose up -d

# Stop
docker compose down

# Rebuild single service
docker compose build --no-cache angular-client
docker compose build --no-cache react-client
```

Both apps use multi-stage builds: Node 20 Alpine builder → Nginx 1.25 Alpine runtime.

---

## 🔦 Lighthouse CI

Performance and accessibility audits run against both apps:

```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run audits (requires both Docker containers running)
lhci autorun

# Reports saved to
./lighthouse-results/
```

### Current Results (local Docker)

| Metric | Angular | React | Threshold |
|---|---|---|---|
| First Contentful Paint | ~4.4s | ~4.3s | warn > 3s |
| Time to Interactive | ~5s | ~5.3s | warn > 6s |
| Accessibility | ✅ | ✅ | > 0.8 |
| Best Practices | ✅ | ✅ | > 0.8 |

> FCP is higher than ideal in local Docker due to MapLibre GL JS bundle size (~1.4MB) and absence of CDN/HTTP2/compression. Production deployment would reduce FCP to ~1s.

---

## 🔧 Scripts Reference

```bash
# Development
pnpm nx serve angular-app              # Angular dev server :4200
pnpm nx serve react-app                # React dev server (Vite) :3000

# Production build
pnpm nx build angular-app --configuration=production
cd apps/react-app && npx vite build

# Tests
cd libs/core && pnpm vitest run                # run once
cd libs/core && pnpm vitest run --coverage     # with coverage
cd libs/core && pnpm vitest                    # watch mode

# Lint
pnpm nx lint angular-app
pnpm nx lint react-app

# Docker
docker compose build --no-cache        # full rebuild
docker compose up -d                   # start detached
docker compose down                    # stop all

# Lighthouse
lhci autorun                           # run audits
```

---

## ⚠️ Known Limitations & Future Improvements

- **Point-only geometry** — only GeoJSON `Point` features are supported. Lines and Polygons would require extending `PoiFeature` with union types and adding corresponding MapLibre paint layers.
- **Single-user, single-browser** — localStorage is per-browser with no sync. Multi-user support requires a backend implementing `IPoiRepository` over HTTP.
- **AI Smart Fixer ambiguity** — coordinates where both values fit within `[-90, 90]` (e.g. Colombian coordinates `[-74, 4.7]`) cannot be auto-detected as swapped without geographic context.
- **Bundle size** — MapLibre GL JS adds ~1.4MB. Code-splitting or dynamic imports could reduce initial load.
- **No authentication** — MVP assumes single authenticated user.
- **Accessibility** — ARIA labels and keyboard navigation are partially implemented. Full WCAG 2.1 AA compliance is a next step.

---

## 📬 Contact

Challenge contact: jorge@mapvx.com
**Dennis Mauricio Martinez Suarez · Lead Frontend Developer**
