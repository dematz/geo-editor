import * as React from 'react';
import { cn } from '../../utils/cn';
import styles from './Label.module.css';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label: React.FC<LabelProps> = ({ required, className, children, ...props }) => (
  <label className={cn(styles.label, className)} {...props}>
    {children}
    {required && <span className={styles.required} aria-hidden="true"> *</span>}
  </label>
);
Label.displayName = 'Label';
