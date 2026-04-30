import { Component, inject, input, output, OnChanges } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import type { PoiFeature, LngLat } from '@geo-editor/core';

@Component({
  selector: 'app-poi-form',
  templateUrl: './poi-form.component.html',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  standalone: true,
})
export class PoiFormComponent implements OnChanges {
  private readonly fb = inject(FormBuilder);

  readonly poi        = input<PoiFeature | null>(null);
  readonly coords     = input<LngLat | null>(null);
  readonly saved      = output<{ name: string; category: string }>();
  readonly cancelled  = output<void>();

  readonly CATEGORIES = [
    'landmark', 'park', 'restaurant', 'hotel',
    'shop', 'transport', 'cafe', 'museum',
    'health', 'education', 'other',
  ];

  form = this.fb.group({
    name:     ['', [Validators.required, Validators.minLength(2)]],
    category: ['', Validators.required],
  });

  get isEditing(): boolean { return !!this.poi(); }

  ngOnChanges(): void {
    const p = this.poi();
    if (p) {
      this.form.patchValue({ name: p.properties.name, category: p.properties.category });
    } else {
      this.form.reset();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.saved.emit(this.form.value as { name: string; category: string });
      this.form.reset();
    }
  }

  onCancel(): void {
    this.form.reset();
    this.cancelled.emit();
  }
}
