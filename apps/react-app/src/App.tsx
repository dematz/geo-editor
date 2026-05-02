import { useEffect, useRef, useState } from 'react';
import { usePoiStore } from './store/poi.store';
import { useMapLibre } from './hooks/useMapLibre';
import { useFileIo } from './hooks/useFileIo';
import {
  TopBar, Sidebar, POIFormModal,
  type POIFormData,
} from '@geo-editor/ui-react';
import { ImportReport } from './components/ImportReport';
import { toCategoryId, CATEGORY_ICONS, SIDEBAR_CATEGORIES } from './utils/categoryMap';
import type { ImportResult, PoiFeature, LngLat } from '@geo-editor/core';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function App() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const {
    restore, filteredFeatures, collection, selectedId,
    loadCollection, selectPoint, removePoint, setFilter,
    undo, redo, canUndo: getCanUndo, canRedo: getCanRedo,
    clearAll, addPoint, updatePoint, features,
  } = usePoiStore();

  // ── FIX (markers): subscribe to `history` (changes on every mutation)
  //    instead of `collection` (stable function ref that never re-renders).
  const history = usePoiStore(s => s.history);

  // ── UI state ────────────────────────────────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [search, setSearch]                     = useState('');
  const [showForm, setShowForm]                 = useState(false);
  const [pendingCoords, setPendingCoords]       = useState<LngLat | null>(null);
  const [editingPoi, setEditingPoi]             = useState<PoiFeature | null>(null);
  const [importResult, setImportResult]         = useState<ImportResult | null>(null);

  // ── Map ─────────────────────────────────────────────
  const { updateData, flyTo, highlightPoi } = useMapLibre(mapContainer, (coords) => {
    setPendingCoords(coords);
    setEditingPoi(null);
    setShowForm(true);
  });

  const { importGeoJson, exportGeoJson } = useFileIo();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { restore(); }, []);

  // ── FIX (markers): depend on `history` so effect re-runs on every mutation ──
  useEffect(() => { updateData(collection()); }, [history, updateData]);

  useEffect(() => { highlightPoi(selectedId); }, [selectedId, highlightPoi]);

  // ── Handlers ────────────────────────────────────────
  function handleSearchChange(value: string) {
    setSearch(value);
    setFilter({ query: value });
  }

  async function handleImport(file: File) {
    try {
      const result = await importGeoJson(file);
      if (result.imported.length > 0) {
        loadCollection({
          type: 'FeatureCollection',
          features: [...collection().features, ...result.imported],
        });
      }
      setImportResult(result);
    } catch (err) {
      console.error('Import failed:', err);
    }
  }

  function handleExport() { exportGeoJson(collection()); }
  function handleUndo()   { undo(); }
  function handleRedo()   { redo(); }

  async function handleClearAll() {
    if (confirm('¿Borrar todos los puntos y reiniciar?')) {
      await clearAll();
    }
  }

  function handleEditRequest(poi: PoiFeature) {
    setEditingPoi(poi);
    setPendingCoords(null);
    setShowForm(true);
  }

  function handleDeleteRequest(id: string) {
    const poi = features().find(f => String(f.id) === id);
    if (poi && confirm(`¿Eliminar "${poi.properties.name}"?`)) {
      removePoint(poi.id!);
    }
  }

  function handleFocusPoi(id: string) {
    selectPoint(id);
    const poi = features().find(f => String(f.id) === id);
    if (poi) {
      const [lng, lat] = poi.geometry.coordinates;
      flyTo(lng, lat);
    }
  }

  function handleNewPoi() {
    setPendingCoords(null);
    setEditingPoi(null);
    setShowForm(true);
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditingPoi(null);
    setPendingCoords(null);
  }

  function handleFormSave(data: POIFormData) {
    if (editingPoi) {
      // ── feat(description): include description in updates ──
      updatePoint(editingPoi.id!, {
        name:        data.name,
        category:    data.category,
        description: data.description,
      });
    } else if (pendingCoords || (data.lat && data.lng)) {
      const coords = pendingCoords ?? { lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
      if (!isNaN(coords.lat) && !isNaN(coords.lng)) {
        // ── feat(description): pass description when creating POI ──
        addPoint(coords, data.name, data.category, data.description);
      }
    }
    setShowForm(false);
    setEditingPoi(null);
    setPendingCoords(null);
  }

  // ── Derived state ───────────────────────────────────
  const allPois    = filteredFeatures();
  const mappedPois = allPois.map(f => ({
    id:       String(f.id),
    name:     f.properties.name,
    category: toCategoryId(f.properties.category),
    icon:     CATEGORY_ICONS[toCategoryId(f.properties.category)],
    lat:      f.geometry.coordinates[1],
    lng:      f.geometry.coordinates[0],
    selected: selectedId === f.id,
  }));

  const modalInitialData = editingPoi
    ? {
        id:          String(editingPoi.id),
        name:        editingPoi.properties.name,
        category:    toCategoryId(editingPoi.properties.category),
        lat:         editingPoi.geometry.coordinates[1].toString(),
        lng:         editingPoi.geometry.coordinates[0].toString(),
        description: editingPoi.properties.description ?? '',
      }
    : pendingCoords
      ? {
          name:        '',
          category:    'custom' as const,
          lat:         pendingCoords.lat.toString(),
          lng:         pendingCoords.lng.toString(),
          description: '',
        }
      : undefined;

  return (
    <div className="app-shell">
      <TopBar
        search={search}
        onSearchChange={handleSearchChange}
        onImport={handleImport}
        onExport={handleExport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={getCanUndo()}
        canRedo={getCanRedo()}
        onClearAll={handleClearAll}
      />

      <ImportReport result={importResult} onDismiss={() => setImportResult(null)} />

      <div className="app-body">
        <Sidebar
          pois={mappedPois}
          categories={SIDEBAR_CATEGORIES}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          onNew={handleNewPoi}
          onEdit={poi => handleEditRequest(features().find(f => String(f.id) === poi)!)}
          onDelete={handleDeleteRequest}
          onFocus={handleFocusPoi}
        />
        <div ref={mapContainer} className="app-map" />
      </div>

      <POIFormModal
        open={showForm}
        initialData={modalInitialData}
        onClose={handleFormCancel}
        onSave={handleFormSave}
      />
    </div>
  );
}
