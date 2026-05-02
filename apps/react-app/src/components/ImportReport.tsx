import type { ImportResult } from '@geo-editor/core';

interface ImportReportProps {
  result:    ImportResult | null;
  onDismiss: () => void;
}

/**
 * P3 — Migrated to use DS tokens via inline CSS custom properties.
 * No external class dependencies — fully self-contained using --ds-* tokens.
 */
export function ImportReport({ result, onDismiss }: ImportReportProps) {
  if (!result) return null;

  const hasErrors = result.errors.length > 0;

  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      gap:            'var(--ds-space-3)',
      flexWrap:       'wrap',
      padding:        `var(--ds-space-3) var(--ds-space-4)`,
      background:     hasErrors
        ? 'oklch(0.99 0.015 75)'
        : 'oklch(0.98 0.02 152)',
      borderLeft:     `4px solid ${hasErrors
        ? 'var(--ds-warning)'
        : 'var(--ds-success)'}`,
      borderBottom:   '1px solid var(--ds-border)',
      fontSize:       'var(--ds-text-sm)',
      flexShrink:     0,
    }}>
      <p style={{
        flex:       1,
        margin:     0,
        fontWeight: 'var(--ds-font-medium)' as React.CSSProperties['fontWeight'],
        color:      'var(--ds-foreground)',
      }}>
        {result.summary}
      </p>

      {hasErrors && (
        <details style={{ width: '100%', fontSize: 'var(--ds-text-xs)', color: 'var(--ds-muted-fg)' }}>
          <summary style={{ cursor: 'pointer', userSelect: 'none' }}>
            Ver detalle de errores ({result.errors.length})
          </summary>
          <ul style={{ margin: 'var(--ds-space-2) 0 0 var(--ds-space-4)', padding: 0 }}>
            {result.errors.map((err) => (
              <li key={err.index} style={{ marginBottom: 'var(--ds-space-1)' }}>
                Feature #{err.index}: {err.message}
              </li>
            ))}
          </ul>
        </details>
      )}

      <button
        onClick={onDismiss}
        style={{
          flexShrink:     0,
          padding:        `var(--ds-space-1-5) var(--ds-space-3)`,
          border:         '1px solid var(--ds-border)',
          borderRadius:   'var(--ds-radius-md)',
          background:     'var(--ds-surface)',
          color:          'var(--ds-foreground)',
          fontSize:       'var(--ds-text-xs)',
          cursor:         'pointer',
          fontWeight:     'var(--ds-font-medium)' as React.CSSProperties['fontWeight'],
          transition:     `background var(--ds-duration-fast) var(--ds-ease-default)`,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--ds-secondary)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'var(--ds-surface)')}
      >
        ✕ Cerrar
      </button>
    </div>
  );
}
