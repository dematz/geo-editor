/**
 * Utility: cn
 * Merge class names sin dependencia de tailwind-merge.
 * Los componentes usan CSS custom properties, no clases Tailwind.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
