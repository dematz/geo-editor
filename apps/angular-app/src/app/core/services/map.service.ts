import { Injectable, NgZone, inject } from '@angular/core';
import maplibregl, { Map, MapMouseEvent } from 'maplibre-gl';
import type { PoiFeatureCollection } from '@geo-editor/core';
import { snapToGrid } from '@geo-editor/core';

const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  layers: [{ id: 'osm-layer', type: 'raster' as const, source: 'osm' }],
};

@Injectable({ providedIn: 'root' })
export class MapService {
  private map!: Map;
  private readonly zone = inject(NgZone);
  private styleLoaded = false;

  // ── FIX: buffer collection that arrives before map 'load' fires ──
  private pendingCollection: PoiFeatureCollection | null = null;

  private readonly SOURCE_ID        = 'pois-source';
  private readonly LAYER_ID         = 'pois-layer';
  private readonly CLUSTER_ID       = 'pois-cluster';
  private readonly CLUSTER_COUNT_ID = 'pois-cluster-count';

  initMap(
    container: HTMLElement,
    onMapClick: (coords: { lng: number; lat: number }) => void
  ): void {
    this.zone.runOutsideAngular(() => {
      this.map = new Map({
        container,
        style: OSM_STYLE as maplibregl.StyleSpecification,
        center: [-74.0721, 4.711],
        zoom: 5,
      });

      this.map.on('load', () => {
        this.setupSourceAndLayers();
        this.styleLoaded = true;

        // ── FIX: flush data that arrived before the map was ready ──
        if (this.pendingCollection) {
          const source = this.map.getSource(this.SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
          source?.setData(this.pendingCollection as GeoJSON.FeatureCollection);
          this.pendingCollection = null;
        }
      });

      this.map.on('click', (e: MapMouseEvent) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: [this.LAYER_ID],
        });
        if (features.length === 0) {
          // ── Snap coordinates to 4-decimal grid (~11m precision) ──
          const snapped = snapToGrid(e.lngLat.lng, e.lngLat.lat);
          this.zone.run(() => onMapClick(snapped));
        }
      });

      this.map.on('mouseenter', this.LAYER_ID, () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', this.LAYER_ID, () => {
        this.map.getCanvas().style.cursor = '';
      });
    });
  }

  updateData(collection: PoiFeatureCollection): void {
    if (!this.styleLoaded) {
      // ── FIX: buffer data until the map 'load' event fires ──
      this.pendingCollection = collection;
      return;
    }
    const source = this.map.getSource(this.SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    if (source) {
      source.setData(collection as GeoJSON.FeatureCollection);
    }
  }

  flyTo(lng: number, lat: number): void {
    this.map?.flyTo({ center: [lng, lat], zoom: 14, speed: 1.5 });
  }

  highlightPoi(id: string | number | null): void {
    if (!this.styleLoaded) return;
    this.map.setPaintProperty(this.LAYER_ID, 'circle-color', [
      'case',
      ['==', ['id'], id ?? ''],
      '#F59E0B',
      '#2563EB',
    ]);
  }

  destroy(): void {
    this.map?.remove();
    this.styleLoaded = false;
    this.pendingCollection = null;
  }

  private setupSourceAndLayers(): void {
    this.map.addSource(this.SOURCE_ID, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    this.map.addLayer({
      id: this.CLUSTER_ID,
      type: 'circle',
      source: this.SOURCE_ID,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step', ['get', 'point_count'],
          '#2563EB', 10, '#7C3AED', 30, '#DB2777',
        ],
        'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40],
        'circle-opacity': 0.85,
      },
    });

    this.map.addLayer({
      id: this.CLUSTER_COUNT_ID,
      type: 'symbol',
      source: this.SOURCE_ID,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 14,
      },
      paint: { 'text-color': '#FFFFFF' },
    });

    this.map.addLayer({
      id: this.LAYER_ID,
      type: 'circle',
      source: this.SOURCE_ID,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-radius': 8,
        'circle-color': '#2563EB',
        'circle-stroke-color': '#FFFFFF',
        'circle-stroke-width': 2,
      },
    });
  }
}
