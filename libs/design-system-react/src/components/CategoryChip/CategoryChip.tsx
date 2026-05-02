import * as React from 'react';
import { cn } from '../../utils/cn';
import styles from './CategoryChip.module.css';

export type CategoryId = 'restaurant' | 'hotel' | 'park' | 'hospital' | 'custom';

export const CATEGORY_COLORS: Record<CategoryId, string> = {
  restaurant: 'var(--ds-cat-restaurant)',
  hotel:      'var(--ds-cat-hotel)',
  park:       'var(--ds-cat-park)',
  hospital:   'var(--ds-cat-hospital)',
  custom:     'var(--ds-cat-custom)',
};

export interface CategoryChipProps {
  category:     CategoryId;
  label:        string;
  interactive?: boolean;
  active?:      boolean;
  onClick?:     () => void;
  className?:   string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category, label, interactive = false, active = false, onClick, className,
}) => {
  const color = CATEGORY_COLORS[category];

  const style: React.CSSProperties = {
    background:  active
      ? `color-mix(in oklab, ${color} 25%, transparent)`
      : `color-mix(in oklab, ${color} 12%, transparent)`,
    borderColor: `color-mix(in oklab, ${color} 35%, transparent)`,
    color:       `color-mix(in oklab, ${color} 75%, var(--ds-foreground))`,
  };

  if (interactive) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        style={style}
        className={cn(styles.chip, styles.interactive, active && styles.active, className)}
      >
        <span className={styles.dot} style={{ background: color }} aria-hidden="true" />
        {label}
      </button>
    );
  }

  return (
    <span style={style} className={cn(styles.chip, className)}>
      <span className={styles.dot} style={{ background: color }} aria-hidden="true" />
      {label}
    </span>
  );
};
CategoryChip.displayName = 'CategoryChip';
