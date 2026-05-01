# Advanced Geo-Editor POI

> **Author:** Dennis Mauricio Martinez Suarez — Lead Frontend Developer  
> **Stack:** Angular 18 · React 19 · TypeScript 5 · MapLibre GL JS · Nx Monorepo · pnpm

A production-ready POI (Point of Interest) editor built with a framework-agnostic core architecture, dual-framework UI (Angular + React), AI-powered import validation, and full Undo/Redo support.

---

## Requirements

| Tool | Version |
|---|---|
| Node | 20 LTS |
| pnpm | 9+ |
| Docker | 24+ (optional) |

---

## Quick Start

```bash
# Install all dependencies
pnpm install

# Run Angular app  →  http://localhost:4200
pnpm nx serve angular-app

# Run React app    →  http://localhost:3000
pnpm nx serve react-app

# Run all unit tests
cd libs/core && pnpm vitest run --coverage
```

## With Docker

```bash
# Build and start both apps
docker compose up --build

# Angular → http://localhost:4200
# React   → http://localhost:3001
```

---

## Project Structure

```
geo-editor/
├── apps/
│   ├── angular-app/              ← Angular 18 standalone components + Signals
│   │   ├── src/app/
│   │   │   ├── core/services/    ← MapService, PoiService, FileIoService
│   │   │   ├── features/         ← map, poi-list, poi-form, toolbar
│   │   │   └── shared/           ← import-report component
│   │   ├── Dockerfile
│   │   └── nginx.conf
│   └── react-app/                ← React 19 + Zustand + Vite
│       ├── src/
│       │   ├── components/       ← Map, PoiList, PoiForm, Toolbar, ImportReport
│       │   ├── hooks/            ← useMapLibre, useFileIo
│       │   └── store/            ← poi.store.ts (Zustand)
│       ├── Dockerfile
│       └── nginx.conf
├── libs/
│   └── core/                     ← Framework-agnostic business logic
│       └── src/
│           ├── domain/           ← Types: PoiFeature, LngLat, IPoiRepository
│           ├── use-cases/
│           │   ├── validators/   ← GeoJSON validation engine
│           │   ├── ai-smart-fixer/ ← Category inference + coordinate repair
│           │   ├── history/      ← Command pattern (Undo/Redo)
│           │   └── search/       ← POI filter by name and category
│           └── infrastructure/   ← LocalStoragePoiRepository
├── docker-compose.yml
├── nx.json
├── pnpm-workspace.yaml
└── README.md
```

---

## Features

### Core functionality
- **Map** — MapLibre GL JS with OpenStreetMap tiles (no API key required)
- **Import GeoJSON** — validates, reports errors, imports only valid Point features
- **Create POIs** — click anywhere on the map to place a point
- **Edit / Delete** — inline form with name and category fields
- **Persistent state** — auto-saved to `localStorage` under key `poi_editor_state`
- **Export** — download current state as `.geojson`
- **Search** — real-time filter by name in the sidebar list
- **Clustering** — native MapLibre cluster layers for dense data sets

### Advanced features
- **Undo / Redo** — Command pattern with 50-step history, works across all mutations
- **AI Smart Fixer** — on import, automatically infers missing categories from POI names and repairs swapped lat/lon coordinates
- **Import report** — detailed banner showing imported count, discarded count with reasons, and AI fixes applied

---

## Architecture Decision Records (ADR)

**ADR-1 — Nx Monorepo with pnpm workspaces**  
Allows Angular and React to share `@geo-editor/core` without code duplication. Each app imports domain types, validators, and use-cases from the same source.

**ADR-2 — Framework-agnostic Core**  
`libs/core` has zero framework dependencies — pure TypeScript. This means all business logic (validation, CRUD, undo/redo, AI fixer) is tested independently from Angular or React, and can be reused by any future client (Vue, Svelte, CLI).

**ADR-3 — Angular Signals (no NgRx)**  
Angular 18 Signals provide fine-grained reactivity without Zone.js overhead. `PoiService` exposes `computed()` signals for `collection`, `filteredFeatures`, `canUndo`, and `canRedo` — the template reacts automatically with zero manual subscriptions.

**ADR-4 — Zustand (no Redux)**  
React state is managed with Zustand — minimal boilerplate, no provider wrapping, computed values as plain functions. The store mirrors `PoiService` from Angular, making cross-framework feature parity easy to maintain.

**ADR-5 — MapLibre GL JS**  
Open-source fork of Mapbox GL JS. No API key, no usage limits, no vendor lock-in. OSM raster tiles are used for the base layer. Clustering is handled natively by the GeoJSON source (`cluster: true`).

**ADR-6 — Command Pattern for Undo/Redo**  
Each mutation (add, update, remove, load) is a `Command` object with `execute()` and `undo()` methods. `HistoryState` holds `past[]`, `present`, and `future[]` — a pure functional implementation with no side effects. History is capped at 50 steps.

**ADR-7 — localStorage as Repository**  
`IPoiRepository` interface decouples the storage mechanism from business logic. The current implementation (`LocalStoragePoiRepository`) fulfills the MVP requirement. Migrating to an HTTP API requires only a new class implementing the same interface — zero changes to use-cases or UI.

**ADR-8 — AI Smart Fixer (offline, no LLM)**  
Category inference uses regex pattern matching against 11 category rules (cafe, restaurant, hotel, park, museum, transport, health, education, shop, landmark). Coordinate repair detects swapped [lat, lon] by checking if the first value fits only the lat range while the second requires the lon range. No external API calls.

---

## Test Coverage

```
Test Files  6 passed (6)
     Tests  67 passed (67)

Coverage (use-cases only):
  poi.use-cases.ts       100% statements
  geojson.validator.ts    90% statements
  ai-smart-fixer/        100% statements
  history/               100% statements
  search/poi-filter.ts   100% statements

Overall: 96.46% statements
```

Run with coverage:
```bash
cd libs/core && pnpm vitest run --coverage
```

---

## Known Limitations & Future Improvements

- **Point-only** — only GeoJSON `Point` features are supported. Lines and Polygons would require extending `PoiFeature` with union types and adding corresponding MapLibre layers.
- **Single-user** — localStorage is per-browser; no multi-user or sync support.
- **AI Smart Fixer** — currently uses offline pattern matching. Can be upgraded to call an LLM API by replacing `inferCategory()` with an async function — the `validateFeatureCollection()` caller already handles async naturally.
- **No authentication** — the MVP assumes a single authenticated user.
- **Coordinate ambiguity** — swapped coordinates where both values fit within `[-90, 90]` (e.g. Colombian coordinates) cannot be detected without geographic context and are left unchanged.

---

## Scripts Reference

```bash
# Development
pnpm nx serve angular-app          # Angular dev server
pnpm nx serve react-app            # React dev server (Vite)

# Production build
pnpm nx build angular-app --configuration=production
cd apps/react-app && npx vite build

# Tests
cd libs/core && pnpm vitest run              # run once
cd libs/core && pnpm vitest run --coverage   # with coverage report
cd libs/core && pnpm vitest                  # watch mode

# Docker
docker compose build --no-cache    # full rebuild
docker compose up -d               # start detached
docker compose down                # stop
```

---

> **Challenge contact:** jorge@mapvx.com  
> **Dennis Mauricio Martinez Suarez · Lead Frontend Developer**
