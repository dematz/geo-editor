# @geo-editor/ui-react

Componentes React 19 nativos para geo-editor.

**Sin Tailwind. Sin Radix. Solo CSS Modules + tokens `--ds-*`.**

## Componentes

| Componente    | Descripción                                  |
|---------------|----------------------------------------------|
| `Button`      | 5 variantes, 4 tamaños, loading state        |
| `Input`       | Prefix icon, error state, a11y               |
| `Textarea`    | Error state, resize vertical                 |
| `Label`       | Required marker                              |
| `Select`      | Color dot por opción, chevron nativo         |
| `CategoryChip`| Static y interactive filter                  |
| `POIItem`     | Hover actions, icon badge, coords            |
| `TopBar`      | Brand + search + import/export + avatar      |
| `Sidebar`     | Collapsible + lista + categorías             |
| `POIFormModal`| Create/Edit con validación y focus trap      |

## Uso

```tsx
import '@geo-editor/tokens'; // primero los tokens
import { Button, POIFormModal } from '@geo-editor/ui-react';
```

## Storybook

```bash
cd libs/design-system-react
pnpm storybook   # http://localhost:6006
```

## Estructura

```
src/
├── components/        ← Componente.tsx + Componente.module.css
├── utils/cn.ts        ← className merger
└── index.ts           ← public API
```
