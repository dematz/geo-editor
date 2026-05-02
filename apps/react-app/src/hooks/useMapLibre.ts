import { useEffect, useRef, useCallback } from 'react';
import maplibregl, { Map } from 'maplibre-gl';
import type { PoiFeatureCollection } from '@geo-editor/core';
import { snapToGrid } from '@geo-editor/core';

const OSM_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [{ id: 'osm-layer', type: 'raster' as const, source: 'osm' }],
};

const SOURCE_ID        = 'pois-source';
const LAYER_ID         = 'pois-layer';
const CLUSTER_ID       = 'pois-cluster';
const CLUSTER_COUNT_ID = 'pois-cluster-count';

/**
 * Initializes MapLibre GL with OSM raster tiles, POI clustering, and highlight support.
 * Uses a stable ref pattern (onClickRef) to avoid stale closures in event listeners.
 * Initializes once per mount and cleans up on unmount. Snaps click coordinates to 4-decimal grid.
 *
 * FIX: Added pendingDataRef to buffer calls to updateData() that arrive before map.on('load')
 * fires. On load, the buffered collection is flushed to the GeoJSON source so markers render
 * correctly even when the store is restored before the map is ready.
 *
 * @param containerRef DOM element to mount the map into
 * @param onMapClick Callback fired when a blank area is clicked (receives snapped coordinates)
 * @returns Object with methods to update data, fly to POI, and highlight a POI by ID
 */
export function useMapLibre(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onMapClick: (coords: { lng: number; lat: number }) => void
) {
  const mapRef          = useRef<Map | null>(null);
  const styleLoaded     = useRef(false);
  const onClickRef      = useRef(onMapClick);
  // ── FIX: buffer data that arrives before the map 'load' event fires ──
  const pendingDataRef  = useRef<PoiFeatureCollection | null>(null);

  onClickRef.current = onMapClick;

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: OSM_STYLE as maplibregl.StyleSpecification,
      center: [-74.0721, 4.711],
      zoom: 5,
    });

    mapRef.current = map;

    map.on('load', () => {
      setupLayers(map);
      styleLoaded.current = true;

      // ── FIX: flush any data that arrived before the map was ready ──
      if (pendingDataRef.current) {
        const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
        source?.setData(pendingDataRef.current as GeoJSON.FeatureCollection);
        pendingDataRef.current = null;
      }
    });

    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: [LAYER_ID] });
      if (features.length === 0) {
        // ── Snap coordinates to 4-decimal grid (~11m precision) ──
        const snapped = snapToGrid(e.lngLat.lng, e.lngLat.lat);
        onClickRef.current(snapped);
      }
    });

    map.on('mouseenter', LAYER_ID, () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', LAYER_ID, () => { map.getCanvas().style.cursor = ''; });

    return () => {
      map.remove();
      styleLoaded.current  = false;
      pendingDataRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onMapClick is accessed via onClickRef, stable ref avoids stale closures
  }, []);

  const updateData = useCallback((collection: PoiFeatureCollection) => {
    if (!styleLoaded.current || !mapRef.current) {
      // ── FIX: buffer data until the map 'load' event fires ──
      pendingDataRef.current = collection;
      return;
    }
    const source = mapRef.current.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
    source?.setData(collection as GeoJSON.FeatureCollection);
  }, []);

  const flyTo = useCallback((lng: number, lat: number) => {
    mapRef.current?.flyTo({ center: [lng, lat], zoom: 14, speed: 1.5 });
  }, []);

  const highlightPoi = useCallback((id: string | number | null) => {
    if (!styleLoaded.current || !mapRef.current) return;
    mapRef.current.setPaintProperty(LAYER_ID, 'circle-color', [
      'case',
      ['==', ['id'], id ?? ''],
      '#F59E0B',
      '#2563EB',
    ]);
  }, []);

  return { updateData, flyTo, highlightPoi };
}

function setupLayers(map: Map): void {
  map.addSource(SOURCE_ID, {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: CLUSTER_ID,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#2563EB', 10, '#7C3AED', 30, '#DB2777'],
      'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40],
      'circle-opacity': 0.85,
    },
  });

  map.addLayer({
    id: CLUSTER_COUNT_ID,
    type: 'symbol',
    source: SOURCE_ID,
    filter: ['has', 'point_count'],
    layout: { 'text-field': '{point_count_abbreviated}', 'text-size': 14 },
    paint: { 'text-color': '#FFFFFF' },
  });

  map.addLayer({
    id: LAYER_ID,
    type: 'circle',
    source: SOURCE_ID,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': 8,
      'circle-color': '#2563EB',
      'circle-stroke-color': '#FFFFFF',
      'circle-stroke-width': 2,
    },
  });
}
