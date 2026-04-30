import { Injectable, signal, computed, inject } from '@angular/core';
import type { PoiFeature, PoiFeatureCollection, LngLat } from '@geo-editor/core';
import {
  createPoi, updatePoi, deletePoi, addPoi, emptyCollection,
  createPoiRepository, filterPois,
} from '@geo-editor/core';
import type { FilterOptions } from '@geo-editor/core';

@Injectable({ providedIn: 'root' })
export class PoiService {
  private readonly repo = createPoiRepository();

  // ── State ──────────────────────────────────────────────
  private readonly _collection = signal<PoiFeatureCollection>(emptyCollection());
  private readonly _selectedId  = signal<string | number | null>(null);
  private readonly _loading     = signal<boolean>(false);
  private readonly _filter      = signal<FilterOptions>({});

  // ── Computed (read-only views) ─────────────────────────
  readonly collection      = this._collection.asReadonly();
  readonly features        = computed(() => this._collection().features);
  readonly selectedId      = this._selectedId.asReadonly();
  readonly loading         = this._loading.asReadonly();
  readonly filteredFeatures = computed(() => filterPois(this.features(), this._filter()));
  readonly selectedPoi     = computed(() =>
    this.features().find((f) => f.id === this._selectedId()) ?? null
  );

  // ── Init ───────────────────────────────────────────────
  async restore(): Promise<void> {
    this._loading.set(true);
    const saved = await this.repo.getAll();
    if (saved) this._collection.set(saved);
    this._loading.set(false);
  }

  // ── Mutations ──────────────────────────────────────────
  addPoint(coords: LngLat, name: string, category: string): void {
    const poi = createPoi(coords, name, category);
    this._collection.update((c) => addPoi(c, poi));
    this.persist();
  }

  updatePoint(id: string | number, updates: Partial<{ name: string; category: string }>): void {
    this._collection.update((c) => updatePoi(c, id, updates));
    this.persist();
  }

  removePoint(id: string | number): void {
    this._collection.update((c) => deletePoi(c, id));
    if (this._selectedId() === id) this._selectedId.set(null);
    this.persist();
  }

  selectPoint(id: string | number | null): void {
    this._selectedId.set(id);
  }

  loadCollection(collection: PoiFeatureCollection): void {
    this._collection.set(collection);
    this.persist();
  }

  setFilter(opts: FilterOptions): void {
    this._filter.set(opts);
  }

  async clearAll(): Promise<void> {
    this._collection.set(emptyCollection());
    this._selectedId.set(null);
    await this.repo.clear();
  }

  private persist(): void {
    this.repo.save(this._collection()).catch(console.error);
  }
}
