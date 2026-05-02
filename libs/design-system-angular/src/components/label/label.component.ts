import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ds-label',
  standalone: true,
  imports: [NgIf],
  template: `
    <label [attr.for]="for" class="label">
      <ng-content></ng-content>
      <span *ngIf="required" class="required" aria-hidden="true"> *</span>
    </label>
  `,
  styles: [`
    :host { display: block; }
    .label {
      display: block;
      font-size: var(--ds-text-sm);
      font-weight: var(--ds-font-medium);
      color: var(--ds-foreground);
      margin-bottom: var(--ds-space-2);
    }
    .required {
      color: var(--ds-destructive);
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class DsLabelComponent {
  @Input() for?: string;
  @Input() required = false;
}
