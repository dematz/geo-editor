import {
  Component, OnDestroy, ElementRef, ViewChild,
  AfterViewInit, effect, inject, output,
} from '@angular/core';
import { MapService } from '../../core/services/map.service';
import { PoiService } from '../../core/services/poi.service';
import type { LngLat } from '@geo-editor/core';

@Component({
  selector: 'app-map',
  standalone: true,
  template: `<div #mapContainer class="map-container"></div>`,
  styles: [`
    .map-container { width: 100%; height: 100%; min-height: 500px; }
  `],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLElement>;

  private readonly mapService = inject(MapService);
  private readonly poiService = inject(PoiService);

  readonly mapClick = output<LngLat>();

  constructor() {
    effect(() => {
      this.mapService.updateData(this.poiService.collection());
    });

    effect(() => {
      this.mapService.highlightPoi(this.poiService.selectedId());
    });
  }

  ngAfterViewInit(): void {
    this.mapService.initMap(this.mapContainer.nativeElement, (coords) => {
      this.mapClick.emit({ lng: coords.lng, lat: coords.lat });
    });
  }

  ngOnDestroy(): void {
    this.mapService.destroy();
  }
}
