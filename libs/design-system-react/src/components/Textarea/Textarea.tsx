import * as React from 'react';
import { cn } from '../../utils/cn';
import styles from './Textarea.module.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, id, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;
    return (
      <div className={styles.wrapper}>
        <textarea
          ref={ref} id={id}
          aria-describedby={errorId}
          aria-invalid={!!error || undefined}
          className={cn(styles.textarea, error && styles.hasError, className)}
          {...props}
        />
        {error && <p id={errorId} role="alert" className={styles.errorMessage}>{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
