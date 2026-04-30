import { Component, inject, output } from '@angular/core';
import { FileIoService } from '../../core/services/file-io.service';
import { PoiService } from '../../core/services/poi.service';
import type { ImportResult } from '@geo-editor/core';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent {
  private readonly fileIo = inject(FileIoService);
  private readonly poiSvc = inject(PoiService);

  readonly importDone = output<ImportResult>();

  async onFileSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      const result = await this.fileIo.importGeoJson(file);
      if (result.imported.length > 0) {
        this.poiSvc.loadCollection({ type: 'FeatureCollection', features: result.imported });
      }
      this.importDone.emit(result);
    } catch (err) {
      console.error('Import failed:', err);
    }
    (event.target as HTMLInputElement).value = '';
  }

  onExport(): void {
    this.fileIo.exportGeoJson(this.poiSvc.collection());
  }

  async onClear(): Promise<void> {
    if (confirm('¿Borrar todos los puntos y reiniciar?')) {
      await this.poiSvc.clearAll();
    }
  }
}
