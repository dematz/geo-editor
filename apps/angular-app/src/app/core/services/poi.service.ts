import { Injectable, signal, computed, inject } from '@angular/core';
import type { PoiFeature, PoiFeatureCollection, LngLat } from '@geo-editor/core';
import {
  emptyCollection, createPoiRepository, filterPois,
  initHistory, applyCommand, undoHistory, redoHistory, canUndo, canRedo,
  addPoiCommand, removePoiCommand, updatePoiCommand, loadCollectionCommand,
} from '@geo-editor/core';
import type { FilterOptions, HistoryState } from '@geo-editor/core';

@Injectable({ providedIn: 'root' })
export class PoiService {
  private readonly repo = createPoiRepository();

  // ── State ──────────────────────────────────────────────
  private readonly _history    = signal<HistoryState>(initHistory(emptyCollection()));
  private readonly _selectedId = signal<string | number | null>(null);
  private readonly _loading    = signal<boolean>(false);
  private readonly _filter     = signal<FilterOptions>({});

  // ── Computed ───────────────────────────────────────────
  readonly collection       = computed(() => this._history().present);
  readonly features         = computed(() => this._history().present.features);
  readonly selectedId       = this._selectedId.asReadonly();
  readonly loading          = this._loading.asReadonly();
  readonly filteredFeatures = computed(() => filterPois(this.features(), this._filter()));
  readonly selectedPoi      = computed(() =>
    this.features().find((f) => f.id === this._selectedId()) ?? null
  );
  readonly canUndo = computed(() => canUndo(this._history()));
  readonly canRedo = computed(() => canRedo(this._history()));

  // ── Init ───────────────────────────────────────────────
  async restore(): Promise<void> {
    this._loading.set(true);
    const saved = await this.repo.getAll();
    if (saved) this._history.set(initHistory(saved));
    this._loading.set(false);
  }

  // ── Mutations ──────────────────────────────────────────

  // ── feat(description): forward optional description to addPoiCommand ──
  addPoint(coords: LngLat, name: string, category: string, description?: string): void {
    this._apply(addPoiCommand(coords, name, category, description));
  }

  // ── feat(description): include description in prev snapshot and updates ──
  updatePoint(id: string | number, updates: Partial<{ name: string; category: string; description: string }>): void {
    const poi = this.features().find((f) => f.id === id);
    if (!poi) return;
    const prev = {
      name:        poi.properties.name,
      category:    poi.properties.category,
      description: poi.properties.description ?? '',
    };
    this._apply(updatePoiCommand(id, prev, updates));
  }

  removePoint(id: string | number): void {
    const poi = this.features().find((f) => f.id === id);
    if (!poi) return;
    if (this._selectedId() === id) this._selectedId.set(null);
    this._apply(removePoiCommand(poi));
  }

  selectPoint(id: string | number | null): void {
    this._selectedId.set(id);
  }

  loadCollection(collection: PoiFeatureCollection): void {
    const cmd = loadCollectionCommand(this.collection(), collection);
    this._apply(cmd);
  }

  setFilter(opts: FilterOptions): void {
    this._filter.set(opts);
  }

  undo(): void {
    const next = undoHistory(this._history());
    this._history.set(next);
    this.repo.save(next.present).catch(console.error);
  }

  redo(): void {
    const next = redoHistory(this._history());
    this._history.set(next);
    this.repo.save(next.present).catch(console.error);
  }

  async clearAll(): Promise<void> {
    this._history.set(initHistory(emptyCollection()));
    this._selectedId.set(null);
    await this.repo.clear();
  }

  private _apply(cmd: Parameters<typeof applyCommand>[1]): void {
    const next = applyCommand(this._history(), cmd);
    this._history.set(next);
    this.repo.save(next.present).catch(console.error);
  }
}
