import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation, OnChanges, SimpleChanges, HostListener, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgIf, NgFor, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DsButtonComponent } from '../button/button.component';
import { DsInputComponent } from '../input/input.component';
import { DsLabelComponent } from '../label/label.component';
import { DsSelectComponent } from '../select/select.component';
import { DsTextareaComponent } from '../textarea/textarea.component';
import { DsIconComponent } from '../icon/icon.component';
import type { CategoryId, PoiFormData, SelectOption } from '../../utils/category-types';
import { CATEGORY_COLORS } from '../../utils/category-types';

const EMPTY: PoiFormData = {
  name: '',
  category: 'custom',
  lat: '',
  lng: '',
  description: '',
};

@Component({
  selector: 'ds-poi-form-modal',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    NgStyle,
    FormsModule,
    DsButtonComponent,
    DsInputComponent,
    DsLabelComponent,
    DsSelectComponent,
    DsTextareaComponent,
    DsIconComponent,
  ],
  template: `
    <div
      *ngIf="open"
      class="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="poi-modal-title"
      (click)="onOverlayClick($event)"
    >
      <div class="modal">
        <div class="header">
          <div>
            <h2
              id="poi-modal-title"
              #titleRef
              tabindex="-1"
              class="title"
            >
              {{ isEditing ? 'Edit POI' : 'New POI' }}
            </h2>
            <p class="subtitle">
              Click on the map to set coordinates, or enter them manually.
            </p>
          </div>
          <button
            type="button"
            (click)="close.emit()"
            class="closeBtn"
            aria-label="Close dialog"
          >
            <ds-icon name="x" [size]="20" class="closeIcon" aria-hidden="true" />
          </button>
        </div>

        <div class="body">
          <div class="field">
            <ds-label htmlFor="poi-name" [required]="true">Name</ds-label>
            <ds-input
              id="poi-name"
              [(ngModel)]="form.name"
              placeholder="e.g. Café de Flore"
              [error]="errors['name']"
            />
          </div>

          <div class="field">
            <ds-label htmlFor="poi-category">Category</ds-label>
            <ds-select
              id="poi-category"
              [(ngModel)]="form.category"
              [options]="categoryOptions"
            />
          </div>

          <div class="coordGrid">
            <div class="field">
              <ds-label htmlFor="poi-lat">Latitude</ds-label>
              <ds-input
                id="poi-lat"
                [(ngModel)]="form.lat"
                placeholder="48.8566"
                [ngStyle]="{ 'font-variant-numeric': 'tabular-nums' }"
                [error]="errors['lat']"
              />
            </div>
            <div class="field">
              <ds-label htmlFor="poi-lng">Longitude</ds-label>
              <ds-input
                id="poi-lng"
                [(ngModel)]="form.lng"
                placeholder="2.3522"
                [ngStyle]="{ 'font-variant-numeric': 'tabular-nums' }"
                [error]="errors['lng']"
              />
            </div>
          </div>

          <div class="field">
            <ds-label htmlFor="poi-desc">Description</ds-label>
            <ds-textarea
              id="poi-desc"
              [(ngModel)]="form.description"
              placeholder="Optional notes…"
              [rows]="3"
            />
          </div>
        </div>

        <div class="footer">
          <ds-button variant="secondary" (click)="close.emit()">Cancel</ds-button>
          <ds-button variant="primary" (click)="handleSave()">
            {{ isEditing ? 'Update POI' : 'Save POI' }}
          </ds-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./poi-form-modal.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsPoiFormModalComponent implements OnChanges {
  @Input() open = false;
  @Input() initialData?: Partial<PoiFormData>;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<PoiFormData>();

  @ViewChild('titleRef') titleRef?: ElementRef<HTMLHeadingElement>;

  form = { ...EMPTY };
  errors: Partial<Record<keyof PoiFormData, string>> = {};
  isEditing = false;
  categoryOptions: SelectOption[] = [];

  constructor() {
    const categoryIds = Object.keys(CATEGORY_COLORS) as CategoryId[];
    this.categoryOptions = categoryIds.map(id => ({
      value: id,
      label: id.charAt(0).toUpperCase() + id.slice(1),
      colorVar: CATEGORY_COLORS[id],
    }));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open) {
      this.form = { ...EMPTY, ...this.initialData };
      this.errors = {};
      this.isEditing = !!this.initialData?.id;
      setTimeout(() => this.titleRef?.nativeElement?.focus(), 50);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.open) {
      this.close.emit();
    }
  }

  handleSave(): void {
    if (this.validate()) {
      this.save.emit(this.form as PoiFormData);
    }
  }

  validate(): boolean {
    const next: Partial<Record<keyof PoiFormData, string>> = {};

    if (!this.form.name.trim()) {
      next.name = 'Name is required';
    }

    if (isNaN(parseFloat(this.form.lat))) {
      next.lat = 'Valid latitude required';
    }

    if (isNaN(parseFloat(this.form.lng))) {
      next.lng = 'Valid longitude required';
    }

    this.errors = next;
    return Object.keys(next).length === 0;
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }
}
