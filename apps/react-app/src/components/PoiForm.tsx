import { useState, useEffect } from 'react';
import { usePoiStore } from '../store/poi.store';
import type { PoiFeature, LngLat } from '@geo-editor/core';

const CATEGORIES = [
  'landmark', 'park', 'restaurant', 'hotel',
  'shop', 'transport', 'cafe', 'museum',
  'health', 'education', 'other',
];

interface PoiFormProps {
  poi:       PoiFeature | null;
  coords:    LngLat | null;
  onSaved:   () => void;
  onCancel:  () => void;
}

export function PoiForm({ poi, coords, onSaved, onCancel }: PoiFormProps) {
  const { addPoint, updatePoint } = usePoiStore();
  const [name, setName]         = useState('');
  const [category, setCategory] = useState('');
  const [touched, setTouched]   = useState(false);

  useEffect(() => {
    if (poi) {
      setName(poi.properties.name);
      setCategory(poi.properties.category);
    } else {
      setName('');
      setCategory('');
    }
    setTouched(false);
  }, [poi]);

  const isValid = name.trim().length >= 2 && category !== '';

  function handleSubmit() {
    setTouched(true);
    if (!isValid) return;

    if (poi) {
      updatePoint(poi.id!, { name: name.trim(), category });
    } else if (coords) {
      addPoint(coords, name.trim(), category);
    }
    onSaved();
  }

  return (
    <div className="poi-form">
      <h4>{poi ? 'Editar POI' : 'Nuevo POI'}</h4>

      {coords && !poi && (
        <p className="poi-form__coords">
          📍 {coords.lng.toFixed(5)}, {coords.lat.toFixed(5)}
        </p>
      )}

      <div className="form-group">
        <label htmlFor="r-poi-name">Nombre *</label>
        <input
          id="r-poi-name"
          type="text"
          className={`form-control${touched && name.trim().length < 2 ? ' is-invalid' : ''}`}
          placeholder="Nombre del POI"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {touched && name.trim().length < 2 && (
          <span className="error-msg">Mínimo 2 caracteres</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="r-poi-category">Categoría *</label>
        <select
          id="r-poi-category"
          className={`form-control${touched && !category ? ' is-invalid' : ''}`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="" disabled>Seleccionar categoría</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {touched && !category && (
          <span className="error-msg">Selecciona una categoría</span>
        )}
      </div>

      <div className="poi-form__actions">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={touched && !isValid}>
          {poi ? '💾 Guardar' : '➕ Agregar'}
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
