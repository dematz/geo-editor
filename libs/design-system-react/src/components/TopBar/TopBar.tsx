import * as React from 'react';
import { Search, Download, Upload, MapPinned, Undo2, Redo2, Trash2 } from 'lucide-react';
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
  userInitials?:    string;
}

export const TopBar: React.FC<TopBarProps> = ({
  search, onSearchChange, onExport, onImport, onUndo, onRedo, canUndo, canRedo, onClearAll, userInitials = 'JD',
}) => {
  const fileRef = React.useRef<HTMLInputElement>(null);

  return (
    <header role="banner" className={styles.topbar}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.logoIcon} aria-hidden="true">
          <MapPinned className={styles.logoSvg} strokeWidth={2.25} />
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
        {/* Undo/Redo/Clear group */}
        {(onUndo || onRedo || onClearAll) && (
          <div className={styles.actionsGroup}>
            {onUndo && (
              <Button
                variant="ghost" size="icon"
                className={styles.iconBtn}
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                aria-label="Undo action"
              >
                <Undo2 aria-hidden="true" />
              </Button>
            )}
            {onRedo && (
              <Button
                variant="ghost" size="icon"
                className={styles.iconBtn}
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                aria-label="Redo action"
              >
                <Redo2 aria-hidden="true" />
              </Button>
            )}
            {onClearAll && (
              <Button
                variant="ghost" size="icon"
                className={styles.iconBtn}
                onClick={onClearAll}
                title="Clear all POIs"
                aria-label="Clear all points"
              >
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
        <Button
          variant="outline" size="sm"
          className={styles.actionBtn}
          onClick={() => fileRef.current?.click()}
          aria-label="Import GeoJSON file"
        >
          <Upload aria-hidden="true" />
          Import GeoJSON
        </Button>
        <Button
          variant="outline" size="sm"
          className={styles.actionBtn}
          onClick={onExport}
          aria-label="Export POIs as GeoJSON"
        >
          <Download aria-hidden="true" />
          Export GeoJSON
        </Button>
        <div
          className={styles.avatar}
          role="img"
          aria-label={`User: ${userInitials}`}
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
};
TopBar.displayName = 'TopBar';
