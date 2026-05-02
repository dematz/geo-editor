import * as React from 'react';
import { cn } from '../../utils/cn';
import styles from './FormElements.module.css';

/* ── Label ───────────────────────────────────────────────── */
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ required, children, className, ...props }) => (
  <label className={cn(styles.label, className)} {...props}>
    {children}
    {required && (
      <span className={styles.required} aria-hidden="true"> *</span>
    )}
  </label>
);
Label.displayName = 'Label';

/* ── Textarea ────────────────────────────────────────────── */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, id, className, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;
    return (
      <div className={styles.fieldWrapper}>
        <textarea
          ref={ref}
          id={id}
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
          className={cn(styles.textarea, error && styles.hasError, className)}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className={styles.errorMsg}>{error}</p>
        )}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';

/* ── Select ──────────────────────────────────────────────── */
export interface SelectOption {
  value: string;
  label: string;
  /** CSS color value shown as a dot before the label */
  colorDot?: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, error, id, className, value, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;
    const selectedOption = options.find(o => o.value === value);

    return (
      <div className={styles.selectWrapper}>
        {/* Color dot indicator for selected category */}
        {selectedOption?.colorDot && (
          <span
            className={styles.selectDot}
            style={{ background: selectedOption.colorDot }}
            aria-hidden="true"
          />
        )}
        <select
          ref={ref}
          id={id}
          value={value}
          aria-describedby={errorId}
          aria-invalid={error ? true : undefined}
          className={cn(
            styles.select,
            selectedOption?.colorDot && styles.withDot,
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
        {/* Chevron icon */}
        <svg
          className={styles.selectChevron}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {error && (
          <p id={errorId} role="alert" className={styles.errorMsg}>{error}</p>
        )}
      </div>
    );
  },
);
Select.displayName = 'Select';
