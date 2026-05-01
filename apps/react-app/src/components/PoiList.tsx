import { useState } from 'react';
import { usePoiStore } from '../store/poi.store';
import type { PoiFeature } from '@geo-editor/core';

interface PoiListProps {
  onEditRequest: (poi: PoiFeature) => void;
  onFlyTo:       (lng: number, lat: number) => void;
}

export function PoiList({ onEditRequest, onFlyTo }: PoiListProps) {
  const { collection, selectedId, selectPoint, removePoint, setFilter, filteredFeatures } = usePoiStore();
  const [query, setQuery] = useState('');

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    setFilter({ query: e.target.value });
  }

  function handleSelect(poi: PoiFeature) {
    selectPoint(poi.id ?? null);
    onFlyTo(poi.geometry.coordinates[0], poi.geometry.coordinates[1]);
  }

  function handleDelete(poi: PoiFeature) {
    if (confirm(`¿Eliminar "${poi.properties.name}"?`)) {
      removePoint(poi.id!);
    }
  }

  const visible = filteredFeatures();

  return (
    <div className="poi-list">
      <div className="poi-list__header">
        <h3>POIs <span className="badge">{collection().features.length}</span></h3>
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por nombre..."
          value={query}
          onChange={handleSearch}
        />
      </div>

      {visible.length === 0 && (
        <p className="poi-list__empty">
          {collection().features.length === 0
            ? 'No hay POIs. Haz clic en el mapa para agregar.'
            : `Sin resultados para "${query}".`}
        </p>
      )}

      <ul className="poi-list__items">
        {visible.map((poi) => (
          <li
            key={poi.id}
            className={`poi-item${selectedId === poi.id ? ' poi-item--selected' : ''}`}
            onClick={() => handleSelect(poi)}
          >
            <div className="poi-item__info">
              <span className="poi-item__name">{poi.properties.name}</span>
              <span className="poi-item__category">{poi.properties.category}</span>
            </div>
            <div className="poi-item__actions">
              <button
                className="btn-icon"
                title="Editar"
                onClick={(e) => { e.stopPropagation(); onEditRequest(poi); }}
              >✏️</button>
              <button
                className="btn-icon btn-icon--danger"
                title="Eliminar"
                onClick={(e) => { e.stopPropagation(); handleDelete(poi); }}
              >🗑</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
