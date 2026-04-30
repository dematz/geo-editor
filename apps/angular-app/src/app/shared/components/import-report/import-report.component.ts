import { Component, input, output } from '@angular/core';
import type { ImportResult } from '@geo-editor/core';

@Component({
  selector: 'app-import-report',
  standalone: true,
  template: `
    @if (result(); as r) {
      <div class="import-report" [class.import-report--has-errors]="r.errors.length > 0">
        <p class="import-report__summary">{{ r.summary }}</p>

        @if (r.errors.length > 0) {
          <details class="import-report__details">
            <summary>Ver detalle de errores ({{ r.errors.length }})</summary>
            <ul>
              @for (err of r.errors; track err.index) {
                <li>Feature #{{ err.index }}: {{ err.message }}</li>
              }
            </ul>
          </details>
        }

        <button class="btn btn-secondary import-report__close" (click)="dismissed.emit()">
          ✕ Cerrar
        </button>
      </div>
    }
  `,
})
export class ImportReportComponent {
  readonly result    = input<ImportResult | null>(null);
  readonly dismissed = output<void>();
}
