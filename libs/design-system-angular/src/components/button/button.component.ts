import { Component, Input, ViewEncapsulation, computed, HostBinding } from '@angular/core';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [NgIf, CommonModule],
  template: `
    <button
      [class]="hostClass()"
      [disabled]="disabled || loading"
      [attr.aria-busy]="loading || null"
      type="button"
    >
      <span *ngIf="loading" class="spinner" aria-hidden="true"></span>
      <ng-content></ng-content>
    </button>
  `,
  styleUrls: ['./button.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DsButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' | 'icon' = 'md';
  @Input() loading = false;
  @Input() disabled = false;

  @HostBinding('attr.class') get attrClass(): string {
    // This allows classes passed to ds-button to be inherited by :host
    return '';
  }

  hostClass = computed(() => {
    const classes = ['button', `variant-${this.variant}`, `size-${this.size}`];
    if (this.loading) classes.push('loading');
    return classes.join(' ');
  });
}
