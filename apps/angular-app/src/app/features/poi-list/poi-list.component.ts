import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { PoiService } from '../../core/services/poi.service';
import { MapService } from '../../core/services/map.service';
import type { PoiFeature } from '@geo-editor/core';

@Component({
  selector: 'app-poi-list',
  templateUrl: './poi-list.component.html',
  imports: [FormsModule, NgFor, NgIf],
  standalone: true,
})
export class PoiListComponent {
  readonly poiSvc    = inject(PoiService);
  readonly mapSvc    = inject(MapService);

  readonly editRequest = output<PoiFeature>();

  searchQuery = '';

  onSearch(): void {
    this.poiSvc.setFilter({ query: this.searchQuery });
  }

  onSelect(poi: PoiFeature): void {
    this.poiSvc.selectPoint(poi.id ?? null);
    this.mapSvc.flyTo(poi.geometry.coordinates[0], poi.geometry.coordinates[1]);
  }

  onEdit(poi: PoiFeature): void {
    this.editRequest.emit(poi);
  }

  onDelete(poi: PoiFeature): void {
    if (confirm(`¿Eliminar "${poi.properties.name}"?`)) {
      this.poiSvc.removePoint(poi.id!);
    }
  }

  trackById(_index: number, poi: PoiFeature): string | number {
    return poi.id ?? _index;
  }
}
