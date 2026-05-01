import { useEffect, useRef, useState } from 'react';
import { usePoiStore } from './store/poi.store';
import { useMapLibre } from './hooks/useMapLibre';
import { Toolbar } from './components/Toolbar';
import { PoiList } from './components/PoiList';
import { PoiForm } from './components/PoiForm';
import { ImportReport } from './components/ImportReport';
import type { ImportResult, PoiFeature, LngLat } from '@geo-editor/core';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function App() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { restore, collection, selectedId } = usePoiStore();

  // ── UI state ────────────────────────────────────────
  const [showForm,      setShowForm]      = useState(false);
  const [pendingCoords, setPendingCoords] = useState<LngLat | null>(null);
  const [editingPoi,    setEditingPoi]    = useState<PoiFeature | null>(null);
  const [importResult,  setImportResult]  = useState<ImportResult | null>(null);

  // ── Map ─────────────────────────────────────────────
  const { updateData, flyTo, highlightPoi } = useMapLibre(mapContainer, (coords) => {
    setPendingCoords(coords);
    setEditingPoi(null);
    setShowForm(true);
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- restore is intentionally called once on mount
  useEffect(() => { restore(); }, []);

  useEffect(() => { updateData(collection); }, [collection, updateData]);

  useEffect(() => { highlightPoi(selectedId); }, [selectedId, highlightPoi]);

  // ── Handlers ────────────────────────────────────────
  function handleEditRequest(poi: PoiFeature) {
    setEditingPoi(poi);
    setPendingCoords(null);
    setShowForm(true);
  }

  function handleFormSaved() {
    setShowForm(false);
    setEditingPoi(null);
    setPendingCoords(null);
  }

  function handleFormCancel() {
    setShowForm(false);
    setEditingPoi(null);
    setPendingCoords(null);
  }

  return (
    <div className="app-layout">
      <Toolbar onImportDone={setImportResult} />

      <ImportReport result={importResult} onDismiss={() => setImportResult(null)} />

      <div className="app-layout__body">
        <div ref={mapContainer} className="app-layout__map" />

        <aside className="app-layout__sidebar">
          <PoiList onEditRequest={handleEditRequest} onFlyTo={flyTo} />

          {showForm && (
            <PoiForm
              poi={editingPoi}
              coords={pendingCoords}
              onSaved={handleFormSaved}
              onCancel={handleFormCancel}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
