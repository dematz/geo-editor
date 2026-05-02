import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
  /** Optional colored dot before label */
  colorVar?: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options:  SelectOption[];
  error?:   string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, error, className, id, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;
    const selected = options.find(o => o.value === props.value);
    return (
      <div className={styles.wrapper}>
        {/* Active option color dot */}
        {selected?.colorVar && (
          <span
            className={styles.colorDot}
            style={{ background: selected.colorVar }}
            aria-hidden="true"
          />
        )}
        <select
          ref={ref} id={id}
          aria-describedby={errorId}
          aria-invalid={!!error || undefined}
          className={cn(
            styles.select,
            selected?.colorVar && styles.withDot,
            error && styles.hasError,
            className,
          )}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className={styles.chevron} aria-hidden="true" />
        {error && <p id={errorId} role="alert" className={styles.errorMessage}>{error}</p>}
      </div>
    );
  },
);
Select.displayName = 'Select';
