import { useRef } from 'react';
import { usePoiStore } from '../store/poi.store';
import { useFileIo } from '../hooks/useFileIo';
import type { ImportResult } from '@geo-editor/core';

interface ToolbarProps {
  onImportDone: (result: ImportResult) => void;
}

export function Toolbar({ onImportDone }: ToolbarProps) {
  const { collection, loadCollection, clearAll } = usePoiStore();
  const { importGeoJson, exportGeoJson } = useFileIo();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await importGeoJson(file);
      if (result.imported.length > 0) {
        const existing = collection.features;
        loadCollection({
          type: 'FeatureCollection',
          features: [...existing, ...result.imported],
        });
      }
      onImportDone(result);
    } catch (err) {
      console.error('Import failed:', err);
    }
    if (inputRef.current) inputRef.current.value = '';
  }

  async function handleClear() {
    if (confirm('¿Borrar todos los puntos y reiniciar?')) {
      await clearAll();
    }
  }

  return (
    <div className="toolbar">
      <label className="btn btn-primary" htmlFor="file-input">
        📂 Importar GeoJSON
      </label>
      <input
        id="file-input"
        ref={inputRef}
        type="file"
        accept=".geojson,.json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button className="btn btn-secondary" onClick={() => exportGeoJson(collection)}>
        💾 Exportar GeoJSON
      </button>
      <button className="btn btn-danger" onClick={handleClear}>
        🗑 Limpiar todo
      </button>
    </div>
  );
}
