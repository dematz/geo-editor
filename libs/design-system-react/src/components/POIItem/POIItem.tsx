import * as React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { CATEGORY_COLORS, type CategoryId } from '../CategoryChip/CategoryChip';
import styles from './POIItem.module.css';

export interface POIItemProps {
  id:        string;
  name:      string;
  category:  CategoryId;
  icon:      React.ElementType;
  lat:       number;
  lng:       number;
  onEdit?:   (id: string) => void;
  onDelete?: (id: string) => void;
  onClick?:  (id: string) => void;
  className?: string;
  selected?: boolean;
}

export const POIItem: React.FC<POIItemProps> = ({
  id, name, category, icon: Icon, lat, lng,
  onEdit, onDelete, onClick, className, selected,
}) => {
  const color = CATEGORY_COLORS[category];

  return (
    <div
      role="listitem"
      tabIndex={0}
      className={cn(styles.item, selected && styles.selected, className)}
      onClick={() => onClick?.(id)}
      onKeyDown={e => e.key === 'Enter' && onClick?.(id)}
      aria-label={`${name}, ${category}`}
    >
      {/* Icon badge */}
      <div
        className={styles.iconBadge}
        style={{ background: `color-mix(in oklab, ${color} 18%, transparent)` }}
        aria-hidden="true"
      >
        <Icon className={styles.icon} style={{ color }} />
      </div>

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.name}>{name}</p>
        <p className={styles.coords}>
          {lat.toFixed(4)}, {lng.toFixed(4)}
        </p>
      </div>

      {/* Actions */}
      {(onEdit || onDelete) && (
        <div className={styles.actions} aria-label="Actions">
          {onEdit && (
            <button
              type="button"
              className={cn(styles.actionBtn, styles.editBtn)}
              onClick={e => { e.stopPropagation(); onEdit(id); }}
              aria-label={`Edit ${name}`}
            >
              <Pencil className={styles.actionIcon} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className={cn(styles.actionBtn, styles.deleteBtn)}
              onClick={e => { e.stopPropagation(); onDelete(id); }}
              aria-label={`Delete ${name}`}
            >
              <Trash2 className={styles.actionIcon} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
POIItem.displayName = 'POIItem';
