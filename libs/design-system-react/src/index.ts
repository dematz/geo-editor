/**
 * @geo-editor/ui-react
 *
 * Public API — importar solo desde este archivo.
 * Tokens CSS: import '@geo-editor/tokens' por separado.
 */

// ── Utilities ──────────────────────────────────────────────
export { cn } from './utils/cn';

// ── Primitivos ─────────────────────────────────────────────
export { Button }       from './components/Button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button/Button';

export { Input }        from './components/Input/Input';
export type { InputProps } from './components/Input/Input';

export { Textarea }     from './components/Textarea/Textarea';
export type { TextareaProps } from './components/Textarea/Textarea';

export { Label }        from './components/Label/Label';
export type { LabelProps } from './components/Label/Label';

export { Select }       from './components/Select/Select';
export type { SelectProps, SelectOption } from './components/Select/Select';

// ── Dominio ────────────────────────────────────────────────
export { CategoryChip, CATEGORY_COLORS } from './components/CategoryChip/CategoryChip';
export type { CategoryChipProps, CategoryId } from './components/CategoryChip/CategoryChip';

export { POIItem }      from './components/POIItem/POIItem';
export type { POIItemProps } from './components/POIItem/POIItem';

// ── Layout ─────────────────────────────────────────────────
export { TopBar }       from './components/TopBar/TopBar';
export type { TopBarProps } from './components/TopBar/TopBar';

export { Sidebar }      from './components/Sidebar/Sidebar';
export type { SidebarProps, SidebarCategory, SidebarPOI } from './components/Sidebar/Sidebar';

export { POIFormModal } from './components/POIFormModal/POIFormModal';
export type { POIFormModalProps, POIFormData } from './components/POIFormModal/POIFormModal';
