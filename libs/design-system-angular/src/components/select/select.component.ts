import { Component, Input, ViewEncapsulation, forwardRef, computed } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DsIconComponent } from '../icon/icon.component';
import type { SelectOption } from '../../utils/category-types';

@Component({
  selector: 'ds-select',
  standalone: true,
  imports: [NgIf, NgFor, DsIconComponent],
  template: `
    <div class="wrapper">
      <span
        *ngIf="selectedOption()?.colorVar"
        class="colorDot"
        [style.background]="selectedOption()?.colorVar"
        aria-hidden="true"
      ></span>
      <select
        [id]="id"
        [class.withDot]="selectedOption()?.colorVar"
        [class.hasError]="error"
        [value]="value"
        [disabled]="isDisabled"
        (change)="onChange($event)"
        (blur)="onTouched()"
        class="select"
      >
        <option *ngFor="let opt of options" [value]="opt.value">
          {{ opt.label }}
        </option>
      </select>
      <ds-icon name="chevron-down" [size]="16" class="chevron" aria-hidden="true" />
      <p *ngIf="error" role="alert" class="errorMessage">{{ error }}</p>
    </div>
  `,
  styleUrls: ['./select.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsSelectComponent),
      multi: true,
    },
  ],
})
export class DsSelectComponent implements ControlValueAccessor {
  @Input() id?: string;
  @Input() options: SelectOption[] = [];
  @Input() error?: string;

  value = '';
  isDisabled = false;

  selectedOption = computed(() => this.options.find(o => o.value === this.value));

  private onChangeCallback: (value: string) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.onChangeCallback(this.value);
  }

  onTouched(): void {
    this.onTouchedCallback();
  }
}
