import * as React from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../Button/Button';
import { POIItem, type POIItemProps } from '../POIItem/POIItem';
import { CategoryChip, type CategoryId } from '../CategoryChip/CategoryChip';
import styles from './Sidebar.module.css';

export interface SidebarCategory {
  id:    CategoryId;
  label: string;
}

export type SidebarPOI = Omit<POIItemProps, 'onEdit' | 'onDelete' | 'onClick'>;

export interface SidebarProps {
  pois:        SidebarPOI[];
  categories:  SidebarCategory[];
  collapsed:   boolean;
  onToggle:    () => void;
  onNew:       () => void;
  onEdit:      (id: string) => void;
  onDelete:    (id: string) => void;
  onFocus:     (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pois, categories, collapsed,
  onToggle, onNew, onEdit, onDelete, onFocus,
}) => (
  <aside
    className={styles.sidebar}
    aria-label="POI list"
    aria-expanded={!collapsed}
    style={{ width: collapsed ? 0 : 'var(--ds-sidebar-width)' }}
  >
    {/* Toggle */}
    <button
      type="button"
      className={styles.toggle}
      onClick={onToggle}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {collapsed
        ? <ChevronRight className={styles.toggleIcon} aria-hidden="true" />
        : <ChevronLeft  className={styles.toggleIcon} aria-hidden="true" />
      }
    </button>

    {!collapsed && (
      <div className={styles.inner}>
        {/* New POI */}
        <div className={styles.newBtnWrapper}>
          <Button variant="primary" size="md" className={styles.newBtn} onClick={onNew}>
            <Plus aria-hidden="true" />
            New POI
          </Button>
        </div>

        {/* Section header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionLabel}>POIs</h2>
          <span className={styles.sectionCount} aria-live="polite">
            {pois.length}
          </span>
        </div>

        {/* POI list */}
        <div role="list" className={styles.list}>
          {pois.length === 0 ? (
            <div className={styles.emptyState}>
              No points yet.<br />Click the map or "New POI".
            </div>
          ) : (
            <div className={styles.listItems}>
              {pois.map(poi => (
                <POIItem
                  key={poi.id} {...poi}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onClick={onFocus}
                />
              ))}
            </div>
          )}
        </div>

        {/* Categories */}
        <div className={styles.categories}>
          <h2 className={styles.sectionLabel}>Categories</h2>
          <div className={styles.chips}>
            {categories.map(cat => (
              <CategoryChip key={cat.id} category={cat.id} label={cat.label} />
            ))}
          </div>
        </div>
      </div>
    )}
  </aside>
);
Sidebar.displayName = 'Sidebar';
