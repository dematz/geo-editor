import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DsButtonComponent } from '../button/button.component';
import { DsInputComponent } from '../input/input.component';
import { DsIconComponent } from '../icon/icon.component';

@Component({
  selector: 'ds-top-bar',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, FormsModule, DsButtonComponent, DsInputComponent, DsIconComponent],
  template: `
    <header role="banner" class="topbar">
      <div class="brand">
        <!-- ── Angular logo — izquierda ── -->
        <div class="logoIcon" aria-hidden="true" title="Angular 18">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"
               style="color: var(--ds-primary-fg); fill: currentColor;">
            <path d="M12 2.5L2 6.2l1.5 13L12 22l8.5-2.8 1.5-13L12 2.5zm0 2.1l6.6 2.2-1.1 9.6L12 19.6l-5.5-3.2-1.1-9.6L12 4.6z"/>
            <path d="M12 7l-3.8 8.5h1.4l.8-2h3.2l.8 2h1.4L12 7zm0 2.5l1.2 2.8h-2.4L12 9.5z"/>
          </svg>
        </div>
        <div class="brandText">
          <span class="brandName">GeoEditor</span>
          <span class="brandSub">POI workspace</span>
        </div>
      </div>

      <div class="searchWrapper">
        <ds-input
          [(ngModel)]="search"
          (ngModelChange)="onSearchChange($event)"
          placeholder="Search POIs by name or category…"
          prefixIcon="search"
          class="searchInput"
          aria-label="Search POIs"
        />
      </div>

      <div class="actions">
        <div class="actionsGroup" *ngIf="onUndo || onRedo || onClearAll">
          <ds-button *ngIf="onUndo" variant="ghost" size="icon" class="iconBtn"
            [disabled]="!canUndo" [title]="'Undo (Ctrl+Z)'"
            (click)="onUndo.emit()" aria-label="Undo action">
            <ds-icon name="undo2" [size]="24" aria-hidden="true" />
          </ds-button>
          <ds-button *ngIf="onRedo" variant="ghost" size="icon" class="iconBtn"
            [disabled]="!canRedo" [title]="'Redo (Ctrl+Y)'"
            (click)="onRedo.emit()" aria-label="Redo action">
            <ds-icon name="redo2" [size]="24" aria-hidden="true" />
          </ds-button>
          <ds-button *ngIf="onClearAll" variant="ghost" size="icon" class="iconBtn"
            [title]="'Clear all POIs'" (click)="onClearAll.emit()" aria-label="Clear all points">
            <ds-icon name="trash2" [size]="24" aria-hidden="true" />
          </ds-button>
        </div>

        <input #fileInput type="file"
          accept=".geojson,.json,application/geo+json,application/json"
          class="fileInput" aria-hidden="true" (change)="onFileSelected($event)" />
        <ds-button variant="outline" size="sm" class="actionBtn"
          (click)="fileInput.click()" aria-label="Import GeoJSON file">
          <ds-icon name="upload" [size]="24" aria-hidden="true" />
          Import GeoJSON
        </ds-button>
        <ds-button variant="outline" size="sm" class="actionBtn"
          (click)="export.emit()" aria-label="Export POIs as GeoJSON">
          <ds-icon name="download" [size]="24" aria-hidden="true" />
          Export GeoJSON
        </ds-button>

        <!-- ── Avatar — iniciales DM ── -->
        <div class="avatar" role="img" aria-label="User: DM">DM</div>
      </div>
    </header>
  `,
  styleUrls: ['./top-bar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DsTopBarComponent {
  @Input() search   = '';
  @Input() canUndo  = false;
  @Input() canRedo  = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() export       = new EventEmitter<void>();
  @Output() import       = new EventEmitter<File>();
  @Output() undo         = new EventEmitter<void>();
  @Output() redo         = new EventEmitter<void>();
  @Output() clearAll     = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  onUndo     = this.undo;
  onRedo     = this.redo;
  onClearAll = this.clearAll;

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (file) {
      this.import.emit(file);
      input.value = '';
    }
  }
}
