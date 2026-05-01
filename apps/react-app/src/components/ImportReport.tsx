import type { ImportResult } from '@geo-editor/core';

interface ImportReportProps {
  result:    ImportResult | null;
  onDismiss: () => void;
}

export function ImportReport({ result, onDismiss }: ImportReportProps) {
  if (!result) return null;

  return (
    <div className={`import-report${result.errors.length > 0 ? ' import-report--has-errors' : ''}`}>
      <p className="import-report__summary">{result.summary}</p>

      {result.errors.length > 0 && (
        <details className="import-report__details">
          <summary>Ver detalle de errores ({result.errors.length})</summary>
          <ul>
            {result.errors.map((err) => (
              <li key={err.index}>Feature #{err.index}: {err.message}</li>
            ))}
          </ul>
        </details>
      )}

      <button className="btn btn-secondary import-report__close" onClick={onDismiss}>
        ✕ Cerrar
      </button>
    </div>
  );
}
