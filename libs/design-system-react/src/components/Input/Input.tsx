import * as React from 'react';
import { cn } from '../../utils/cn';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixIcon?: React.ReactNode;
  error?:      string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ prefixIcon, error, className, id, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;
    return (
      <div className={styles.wrapper}>
        {prefixIcon && (
          <span className={styles.prefixIcon} aria-hidden="true">
            {prefixIcon}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          aria-describedby={errorId}
          aria-invalid={!!error || undefined}
          className={cn(
            styles.input,
            prefixIcon && styles.withPrefix,
            error      && styles.hasError,
            className,
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className={styles.errorMessage}>
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';
