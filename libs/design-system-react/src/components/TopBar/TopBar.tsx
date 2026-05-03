import * as React from 'react';
import { Search, Download, Upload, Undo2, Redo2, Trash2 } from 'lucide-react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import styles from './TopBar.module.css';

export interface TopBarProps {
  search:           string;
  onSearchChange:   (value: string) => void;
  onExport:         () => void;
  onImport:         (file: File) => void;
  onUndo?:          () => void;
  onRedo?:          () => void;
  canUndo?:         boolean;
  canRedo?:         boolean;
  onClearAll?:      () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  search, onSearchChange, onExport, onImport, onUndo, onRedo, canUndo, canRedo, onClearAll,
}) => {
  const fileRef = React.useRef<HTMLInputElement>(null);

  return (
    <header role="banner" className={styles.topbar}>
      {/* Brand */}
      <div className={styles.brand}>
        {/* ── React logo — izquierda ── */}
        <div className={styles.logoIcon} aria-hidden="true" title="React 19">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"
               style={{ color: 'var(--ds-primary-fg)' }}>
            <circle cx="12" cy="12" r="2.25" fill="currentColor" />
            <ellipse cx="12" cy="12" rx="10" ry="3.8"
              stroke="currentColor" strokeWidth="1.25" fill="none" />
            <ellipse cx="12" cy="12" rx="10" ry="3.8"
              stroke="currentColor" strokeWidth="1.25" fill="none"
              transform="rotate(60 12 12)" />
            <ellipse cx="12" cy="12" rx="10" ry="3.8"
              stroke="currentColor" strokeWidth="1.25" fill="none"
              transform="rotate(120 12 12)" />
          </svg>
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandName}>GeoEditor</span>
          <span className={styles.brandSub}>POI workspace</span>
        </div>
      </div>

      {/* Search */}
      <div className={styles.searchWrapper}>
        <Input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search POIs by name or category…"
          prefixIcon={<Search />}
          className={styles.searchInput}
          aria-label="Search POIs"
        />
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {(onUndo || onRedo || onClearAll) && (
          <div className={styles.actionsGroup}>
            {onUndo && (
              <Button variant="ghost" size="icon" className={styles.iconBtn}
                onClick={onUndo} disabled={!canUndo}
                title="Undo (Ctrl+Z)" aria-label="Undo action">
                <Undo2 aria-hidden="true" />
              </Button>
            )}
            {onRedo && (
              <Button variant="ghost" size="icon" className={styles.iconBtn}
                onClick={onRedo} disabled={!canRedo}
                title="Redo (Ctrl+Y)" aria-label="Redo action">
                <Redo2 aria-hidden="true" />
              </Button>
            )}
            {onClearAll && (
              <Button variant="ghost" size="icon" className={styles.iconBtn}
                onClick={onClearAll} title="Clear all POIs" aria-label="Clear all points">
                <Trash2 aria-hidden="true" />
              </Button>
            )}
          </div>
        )}

        <input
          ref={fileRef} type="file"
          accept=".geojson,.json,application/geo+json,application/json"
          className={styles.fileInput}
          aria-hidden="true"
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) onImport(f);
            e.target.value = '';
          }}
        />
        <Button variant="outline" size="sm" className={styles.actionBtn}
          onClick={() => fileRef.current?.click()} aria-label="Import GeoJSON file">
          <Upload aria-hidden="true" />
          Import GeoJSON
        </Button>
        <Button variant="outline" size="sm" className={styles.actionBtn}
          onClick={onExport} aria-label="Export POIs as GeoJSON">
          <Download aria-hidden="true" />
          Export GeoJSON
        </Button>

        {/* ── Avatar — iniciales DM ── */}
        <div className={styles.avatar} role="img" aria-label="User: DM">
          DM
        </div>
      </div>
    </header>
  );
};
TopBar.displayName = 'TopBar';
