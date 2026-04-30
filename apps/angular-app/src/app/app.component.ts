import { Component, OnInit, inject, signal } from '@angular/core';
import { PoiService } from './core/services/poi.service';
import { MapService } from './core/services/map.service';
import { MapComponent } from './features/map/map.component';
import { ToolbarComponent } from './features/toolbar/toolbar.component';
import { PoiListComponent } from './features/poi-list/poi-list.component';
import { PoiFormComponent } from './features/poi-form/poi-form.component';
import { ImportReportComponent } from './shared/components/import-report/import-report.component';
import type { ImportResult, PoiFeature, LngLat } from '@geo-editor/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    MapComponent,
    ToolbarComponent,
    PoiListComponent,
    PoiFormComponent,
    ImportReportComponent,
  ],
})
export class AppComponent implements OnInit {
  private readonly poiSvc = inject(PoiService);
  private readonly mapSvc = inject(MapService);

  readonly showForm      = signal(false);
  readonly pendingCoords = signal<LngLat | null>(null);
  readonly editingPoi    = signal<PoiFeature | null>(null);
  readonly importResult  = signal<ImportResult | null>(null);

  async ngOnInit(): Promise<void> {
    await this.poiSvc.restore();
  }

  onMapClick(coords: { lng: number; lat: number }): void {
    this.pendingCoords.set(coords);
    this.editingPoi.set(null);
    this.showForm.set(true);
  }

  onEditRequest(poi: PoiFeature): void {
    this.editingPoi.set(poi);
    this.pendingCoords.set(null);
    this.showForm.set(true);
  }

  onFormSaved(values: { name: string; category: string }): void {
    const editing = this.editingPoi();
    if (editing) {
      this.poiSvc.updatePoint(editing.id!, values);
    } else {
      const coords = this.pendingCoords();
      if (coords) this.poiSvc.addPoint(coords, values.name, values.category);
    }
    this.closeForm();
  }

  onFormCancelled(): void {
    this.closeForm();
  }

  onImportDone(result: ImportResult): void {
    this.importResult.set(result);
  }

  onImportReportDismissed(): void {
    this.importResult.set(null);
  }

  private closeForm(): void {
    this.showForm.set(false);
    this.editingPoi.set(null);
    this.pendingCoords.set(null);
  }
}
