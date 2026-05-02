# @geo-editor/tokens

Design token system CSS-first para geo-editor.

**Zero JS. Zero framework. Compatible con Angular 18 y React 19.**

---

## Estructura

```
src/
├── tokens/
│   ├── colors.css       ← Paleta oklch + dark mode
│   ├── typography.css   ← Escala, pesos, tracking
│   ├── spacing.css      ← Espaciado 4px, radios, sombras, z-index
│   └── animations.css   ← @keyframes compartidos
├── styles/
│   ├── reset.css        ← Reset mínimo usando tokens
│   ├── utilities.css    ← Layout, sr-only, shell classes
│   └── maplibre.css     ← Overrides MapLibre GL
└── index.css            ← Entry point único
```

---

## Consumo

### React (Vite) — `apps/react-app/src/main.tsx`
```ts
import '@geo-editor/tokens';
```

### Angular — `apps/angular-app/angular.json`
```json
"styles": [
  "node_modules/@geo-editor/tokens/src/index.css"
]
```

### Import selectivo
```css
@import '@geo-editor/tokens/colors';
@import '@geo-editor/tokens/spacing';
```

---

## Tokens disponibles

### Colores
| Token | Uso |
|---|---|
| `--ds-primary` | Botón principal, iconos activos |
| `--ds-topbar` | Fondo del topbar |
| `--ds-sidebar` | Fondo del sidebar |
| `--ds-cat-restaurant` | Color categoría restaurante |
| `--ds-destructive` | Eliminar, errores |
| `--ds-success` | Confirmaciones |

### Espaciado
Escala base 4px: `--ds-space-1` (4px) → `--ds-space-16` (64px)

### Dimensiones de componentes
| Token | Valor |
|---|---|
| `--ds-topbar-height` | 56px |
| `--ds-sidebar-width` | 280px |
| `--ds-modal-max-width` | 460px |

### Dark mode
Añadir clase `.dark` al elemento `<html>`:
```ts
document.documentElement.classList.toggle('dark');
```

---

## Reglas
- **Nunca** hardcodear valores de color o espaciado en apps o componentes
- **Siempre** referenciar via `var(--ds-*)`
- Los tokens de `colors.css` son la única fuente de verdad visual
