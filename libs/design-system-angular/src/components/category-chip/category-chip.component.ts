import { Component, Input, Output, EventEmitter, ViewEncapsulation, computed } from '@angular/core';
import { NgIf } from '@angular/common';
import type { CategoryId } from '../../utils/category-types';
import { CATEGORY_COLORS } from '../../utils/category-types';

@Component({
  selector: 'ds-category-chip',
  standalone: true,
  imports: [NgIf],
  template: `
    <button
      *ngIf="interactive; else staticChip"
      type="button"
      [style]="chipStyle()"
      [class.chip]="true"
      [class.interactive]="true"
      [class.active]="active"
      [attr.aria-pressed]="active"
      (click)="chipClick.emit()"
    >
      <span class="dot" [style.background]="CATEGORY_COLORS[category]" aria-hidden="true"></span>
      {{ label }}
    </button>

    <ng-template #staticChip>
      <span [style]="chipStyle()" class="chip">
        <span class="dot" [style.background]="CATEGORY_COLORS[category]" aria-hidden="true"></span>
        {{ label }}
      </span>
    </ng-template>
  `,
  styleUrls: ['./category-chip.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DsCategoryChipComponent {
  @Input() category!: CategoryId;
  @Input() label!: string;
  @Input() interactive = false;
  @Input() active = false;
  @Output() chipClick = new EventEmitter<void>();

  CATEGORY_COLORS = CATEGORY_COLORS;

  chipStyle = computed(() => {
    const color = CATEGORY_COLORS[this.category];
    return {
      background: this.active
        ? `color-mix(in oklab, ${color} 25%, transparent)`
        : `color-mix(in oklab, ${color} 12%, transparent)`,
      borderColor: `color-mix(in oklab, ${color} 35%, transparent)`,
      color: `color-mix(in oklab, ${color} 75%, var(--ds-foreground))`,
    };
  });
}
