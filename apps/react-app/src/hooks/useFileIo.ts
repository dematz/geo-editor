import { useCallback } from 'react';
import { validateFeatureCollection } from '@geo-editor/core';
import type { ImportResult, PoiFeatureCollection } from '@geo-editor/core';

export function useFileIo() {
  const importGeoJson = useCallback((file: File): Promise<ImportResult> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const raw = JSON.parse(e.target?.result as string);
          resolve(validateFeatureCollection(raw));
        } catch {
          reject(new Error('El archivo no es un JSON válido'));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(file);
    });
  }, []);

  const exportGeoJson = useCallback((collection: PoiFeatureCollection, filename = 'pois_export.geojson') => {
    const blob = new Blob([JSON.stringify(collection, null, 2)], { type: 'application/geo+json' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href     = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return { importGeoJson, exportGeoJson };
}
