import { Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DsIconComponent } from '../icon/icon.component';
import type { IconName } from '../../utils/category-types';

@Component({
  selector: 'ds-input',
  standalone: true,
  imports: [NgIf, DsIconComponent],
  template: `
    <div class="wrapper">
      <ds-icon
        *ngIf="prefixIcon"
        [name]="prefixIcon"
        class="prefixIcon"
      />
      <input
        [id]="id"
        [type]="type || 'text'"
        [placeholder]="placeholder || ''"
        [class.withPrefix]="prefixIcon"
        [class.hasError]="error"
        [value]="value"
        [disabled]="isDisabled"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="input"
      />
      <p *ngIf="error" role="alert" class="errorMessage">{{ error }}</p>
    </div>
  `,
  styleUrls: ['./input.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsInputComponent),
      multi: true,
    },
  ],
})
export class DsInputComponent implements ControlValueAccessor {
  @Input() id?: string;
  @Input() type?: string;
  @Input() placeholder?: string;
  @Input() prefixIcon?: IconName;
  @Input() error?: string;

  value = '';
  isDisabled = false;

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

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChangeCallback(this.value);
  }

  onTouched(): void {
    this.onTouchedCallback();
  }
}
