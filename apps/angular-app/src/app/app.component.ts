import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { PoiService } from './core/services/poi.service';
import { MapService } from './core/services/map.service';
import { FileIoService } from './core/services/file-io.service';
import { MapComponent } from './features/map/map.component';
import { ImportReportComponent } from './shared/components/import-report/import-report.component';
import { DsTopBarComponent, DsSidebarComponent, DsPoiFormModalComponent, type PoiFormData, type SidebarPoi, type SidebarCategory } from '@geo-editor/ui-angular';
import { toCategoryId, SIDEBAR_CATEGORIES } from './utils/category-map';
import type { ImportResult, PoiFeature, LngLat } from '@geo-editor/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    MapComponent,
    ImportReportComponent,
    DsTopBarComponent,
    DsSidebarComponent,
    DsPoiFormModalComponent,
  ],
})
export class AppComponent implements OnInit {
  readonly poiSvc = inject(PoiService);
  private readonly mapSvc     = inject(MapService);
  private readonly fileIoSvc  = inject(FileIoService);

  readonly sidebarCollapsed = signal(false);
  readonly search           = signal('');
  readonly showForm         = signal(false);
  readonly pendingCoords    = signal<LngLat | null>(null);
  readonly editingPoi       = signal<PoiFeature | null>(null);
  readonly importResult     = signal<ImportResult | null>(null);

  readonly SIDEBAR_CATEGORIES = SIDEBAR_CATEGORIES;

  readonly mappedPois = computed(() => {
    const allPois = this.poiSvc.filteredFeatures();
    return allPois.map(f => ({
      id:       String(f.id),
      name:     f.properties.name,
      category: toCategoryId(f.properties.category),
      lat:      f.geometry.coordinates[1],
      lng:      f.geometry.coordinates[0],
      selected: this.poiSvc.selectedId() === f.id,
    } as SidebarPoi));
  });

  readonly modalInitialData = computed(() => {
    const editingPoi    = this.editingPoi();
    const pendingCoords = this.pendingCoords();

    if (editingPoi) {
      return {
        id:          String(editingPoi.id),
        name:        editingPoi.properties.name,
        category:    toCategoryId(editingPoi.properties.category),
        lat:         editingPoi.geometry.coordinates[1].toString(),
        lng:         editingPoi.geometry.coordinates[0].toString(),
        description: editingPoi.properties.description ?? '',
      };
    }

    if (pendingCoords) {
      return {
        name:        '',
        category:    'custom' as const,
        lat:         pendingCoords.lat.toString(),
        lng:         pendingCoords.lng.toString(),
        description: '',
      };
    }

    return undefined;
  });

  async ngOnInit(): Promise<void> {
    await this.poiSvc.restore();
  }

  onMapClick(coords: LngLat): void {
    this.pendingCoords.set(coords);
    this.editingPoi.set(null);
    this.showForm.set(true);
  }

  onSearchChange(query: string): void {
    this.search.set(query);
    this.poiSvc.setFilter({ query });
  }

  async onImport(file: File): Promise<void> {
    try {
      const result = await this.fileIoSvc.importGeoJson(file);
      if (result.imported.length > 0) {
        const collection = this.poiSvc.collection();
        this.poiSvc.loadCollection({
          type: 'FeatureCollection',
          features: [...collection.features, ...result.imported],
        });
      }
      this.importResult.set(result);
    } catch (err) {
      console.error('Import failed:', err);
    }
  }

  onExport(): void {
    this.fileIoSvc.exportGeoJson(this.poiSvc.collection());
  }

  onUndo(): void  { this.poiSvc.undo(); }
  onRedo(): void  { this.poiSvc.redo(); }

  async onClearAll(): Promise<void> {
    if (confirm('¿Borrar todos los puntos y reiniciar?')) {
      await this.poiSvc.clearAll();
    }
  }

  onNewPoi(): void {
    this.pendingCoords.set(null);
    this.editingPoi.set(null);
    this.showForm.set(true);
  }

  onEditById(id: string): void {
    const poi = this.poiSvc.features().find(f => String(f.id) === id);
    if (poi) {
      this.editingPoi.set(poi);
      this.pendingCoords.set(null);
      this.showForm.set(true);
    }
  }

  onDeletePoi(id: string): void {
    const poi = this.poiSvc.features().find(f => String(f.id) === id);
    if (poi && confirm(`¿Eliminar "${poi.properties.name}"?`)) {
      this.poiSvc.removePoint(poi.id!);
    }
  }

  onFocusPoi(id: string): void {
    this.poiSvc.selectPoint(id);
    const poi = this.poiSvc.features().find(f => String(f.id) === id);
    if (poi) {
      const [lng, lat] = poi.geometry.coordinates;
      this.mapSvc.flyTo(lng, lat);
    }
  }

  onModalClose(): void {
    this.showForm.set(false);
    this.editingPoi.set(null);
    this.pendingCoords.set(null);
  }

  onModalSave(data: PoiFormData): void {
    if (this.editingPoi()) {
      // ── feat(description): include description in update ──
      this.poiSvc.updatePoint(this.editingPoi()!.id!, {
        name:        data.name,
        category:    data.category,
        description: data.description,
      });
    } else {
      const coords = this.pendingCoords() ??
        (data.lat && data.lng
          ? { lat: parseFloat(data.lat), lng: parseFloat(data.lng) }
          : null);
      if (coords && !isNaN(coords.lat) && !isNaN(coords.lng)) {
        // ── feat(description): pass description when creating POI ──
        this.poiSvc.addPoint(coords, data.name, data.category, data.description);
      }
    }
    this.onModalClose();
  }

  onImportReportDismissed(): void {
    this.importResult.set(null);
  }

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }
}
