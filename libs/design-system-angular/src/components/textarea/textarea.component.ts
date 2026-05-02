import { Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ds-textarea',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="wrapper">
      <textarea
        [placeholder]="placeholder || ''"
        [class.hasError]="error"
        [value]="value"
        [disabled]="isDisabled"
        [rows]="rows || 3"
        (input)="onInput($event)"
        (blur)="onTouched()"
        class="textarea"
      ></textarea>
      <p *ngIf="error" role="alert" class="errorMessage">{{ error }}</p>
    </div>
  `,
  styleUrls: ['./textarea.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DsTextareaComponent),
      multi: true,
    },
  ],
})
export class DsTextareaComponent implements ControlValueAccessor {
  @Input() placeholder?: string;
  @Input() rows?: number;
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
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.onChangeCallback(this.value);
  }

  onTouched(): void {
    this.onTouchedCallback();
  }
}
