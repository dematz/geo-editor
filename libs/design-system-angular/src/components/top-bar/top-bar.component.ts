import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation, NgZone } from '@angular/core';
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
        <div class="logoIcon" aria-hidden="true">
          <ds-icon name="map-pinned" [size]="18" class="logoSvg" />
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
          <ds-button
            *ngIf="onUndo"
            variant="ghost"
            size="icon"
            class="iconBtn"
            [disabled]="!canUndo"
            [title]="'Undo (Ctrl+Z)'"
            (click)="onUndo.emit()"
            aria-label="Undo action"
          >
            <ds-icon name="undo2" [size]="24" aria-hidden="true" />
          </ds-button>
          <ds-button
            *ngIf="onRedo"
            variant="ghost"
            size="icon"
            class="iconBtn"
            [disabled]="!canRedo"
            [title]="'Redo (Ctrl+Y)'"
            (click)="onRedo.emit()"
            aria-label="Redo action"
          >
            <ds-icon name="redo2" [size]="24" aria-hidden="true" />
          </ds-button>
          <ds-button
            *ngIf="onClearAll"
            variant="ghost"
            size="icon"
            class="iconBtn"
            [title]="'Clear all POIs'"
            (click)="onClearAll.emit()"
            aria-label="Clear all points"
          >
            <ds-icon name="trash2" [size]="24" aria-hidden="true" />
          </ds-button>
        </div>

        <input
          #fileInput
          type="file"
          accept=".geojson,.json,application/geo+json,application/json"
          class="fileInput"
          aria-hidden="true"
          (change)="onFileSelected($event)"
        />
        <ds-button
          variant="outline"
          size="sm"
          class="actionBtn"
          (click)="fileInput.click()"
          aria-label="Import GeoJSON file"
        >
          <ds-icon name="upload" [size]="24" aria-hidden="true" />
          Import GeoJSON
        </ds-button>
        <ds-button
          variant="outline"
          size="sm"
          class="actionBtn"
          (click)="export.emit()"
          aria-label="Export POIs as GeoJSON"
        >
          <ds-icon name="download" [size]="24" aria-hidden="true" />
          Export GeoJSON
        </ds-button>
        <div
          class="avatar"
          role="img"
          [attr.aria-label]="'User: ' + userInitials"
        >
          {{ userInitials }}
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./top-bar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DsTopBarComponent {
  @Input() search = '';
  @Input() canUndo = false;
  @Input() canRedo = false;
  @Input() userInitials = 'JD';

  @Output() searchChange = new EventEmitter<string>();
  @Output() export = new EventEmitter<void>();
  @Output() import = new EventEmitter<File>();
  @Output() undo = new EventEmitter<void>();
  @Output() redo = new EventEmitter<void>();
  @Output() clearAll = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;

  onUndo = this.undo;
  onRedo = this.redo;
  onClearAll = this.clearAll;

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.import.emit(file);
      input.value = '';
    }
  }
}
