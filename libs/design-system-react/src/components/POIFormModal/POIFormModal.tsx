import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Label } from '../Label/Label';
import { Select } from '../Select/Select';
import { Textarea } from '../Textarea/Textarea';
import { CATEGORY_COLORS, type CategoryId } from '../CategoryChip/CategoryChip';
import styles from './POIFormModal.module.css';

export interface POIFormData {
  id?:          string;
  name:         string;
  category:     CategoryId;
  lat:          string;
  lng:          string;
  description:  string;
}

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_COLORS) as CategoryId[]).map(id => ({
  value: id,
  label: id.charAt(0).toUpperCase() + id.slice(1),
  colorVar: CATEGORY_COLORS[id],
}));

const EMPTY: POIFormData = { name: '', category: 'custom', lat: '', lng: '', description: '' };

export interface POIFormModalProps {
  open:          boolean;
  initialData?:  Partial<POIFormData>;
  onClose:       () => void;
  onSave:        (data: POIFormData) => void;
}

export const POIFormModal: React.FC<POIFormModalProps> = ({
  open, initialData, onClose, onSave,
}) => {
  const [form, setForm] = React.useState<POIFormData>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof POIFormData, string>>>({});
  const titleRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setForm({ ...EMPTY, ...initialData });
    setErrors({});
    setTimeout(() => titleRef.current?.focus(), 50);
  }, [open, initialData]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const set = (field: keyof POIFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!form.name.trim())             next.name = 'Name is required';
    if (isNaN(parseFloat(form.lat)))   next.lat  = 'Valid latitude required';
    if (isNaN(parseFloat(form.lng)))   next.lng  = 'Valid longitude required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = () => { if (validate()) onSave(form); };

  if (!open) return null;

  const isEditing = !!initialData?.id;

  return (
    <div
      className={styles.overlay}
      role="dialog" aria-modal="true" aria-labelledby="poi-modal-title"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2
              id="poi-modal-title" ref={titleRef} tabIndex={-1}
              className={styles.title}
            >
              {isEditing ? 'Edit POI' : 'New POI'}
            </h2>
            <p className={styles.subtitle}>
              Click on the map to set coordinates, or enter them manually.
            </p>
          </div>
          <button
            type="button" onClick={onClose}
            className={styles.closeBtn} aria-label="Close dialog"
          >
            <X className={styles.closeIcon} aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.field}>
            <Label htmlFor="poi-name" required>Name</Label>
            <Input
              id="poi-name" value={form.name}
              onChange={set('name')} placeholder="e.g. Café de Flore"
              error={errors.name} autoFocus
            />
          </div>

          <div className={styles.field}>
            <Label htmlFor="poi-category">Category</Label>
            <Select
              id="poi-category" value={form.category}
              onChange={set('category')} options={CATEGORY_OPTIONS}
            />
          </div>

          <div className={styles.coordGrid}>
            <div className={styles.field}>
              <Label htmlFor="poi-lat">Latitude</Label>
              <Input
                id="poi-lat" value={form.lat} onChange={set('lat')}
                placeholder="48.8566" className={styles.mono}
                error={errors.lat}
              />
            </div>
            <div className={styles.field}>
              <Label htmlFor="poi-lng">Longitude</Label>
              <Input
                id="poi-lng" value={form.lng} onChange={set('lng')}
                placeholder="2.3522" className={styles.mono}
                error={errors.lng}
              />
            </div>
          </div>

          <div className={styles.field}>
            <Label htmlFor="poi-desc">Description</Label>
            <Textarea
              id="poi-desc" value={form.description}
              onChange={set('description')} placeholder="Optional notes…" rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary"   onClick={handleSave}>
            {isEditing ? 'Update POI' : 'Save POI'}
          </Button>
        </div>
      </div>
    </div>
  );
};
POIFormModal.displayName = 'POIFormModal';
