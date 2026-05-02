import { Component, Input, Output, EventEmitter, ViewEncapsulation, computed, HostListener } from '@angular/core';
import { NgIf } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { DsIconComponent } from '../icon/icon.component';
import type { CategoryId, IconName } from '../../utils/category-types';
import { CATEGORY_COLORS } from '../../utils/category-types';

const CATEGORY_ICONS: Record<CategoryId, IconName> = {
  restaurant: 'utensils',
  hotel:      'hotel',
  park:       'trees',
  hospital:   'cross',
  custom:     'map-pin',
};

@Component({
  selector: 'ds-poi-item',
  standalone: true,
  imports: [NgIf, DecimalPipe, DsIconComponent],
  template: `
    <div
      role="listitem"
      [attr.tabindex]="0"
      [class.item]="true"
      [class.selected]="selected"
      [attr.aria-label]="name + ', ' + category"
      (click)="onClick.emit(id)"
      (keydown)="onKeyDown($event)"
    >
      <div
        class="iconBadge"
        [style.background]="badgeBackground()"
        aria-hidden="true"
      >
        <ds-icon [name]="iconName()" class="icon" [style.color]="color()" />
      </div>

      <div class="content">
        <p class="name">{{ name }}</p>
        <p class="coords">
          {{ lat | number: '1.4-4' }}, {{ lng | number: '1.4-4' }}
        </p>
      </div>

      <div class="actions" *ngIf="edit || delete" [attr.aria-label]="'Actions'">
        <button
          *ngIf="edit"
          type="button"
          class="actionBtn editBtn"
          [attr.aria-label]="'Edit ' + name"
          (click)="stopPropagationAndEmit($event, 'edit')"
        >
          <ds-icon name="pencil" class="actionIcon" />
        </button>
        <button
          *ngIf="delete"
          type="button"
          class="actionBtn deleteBtn"
          [attr.aria-label]="'Delete ' + name"
          (click)="stopPropagationAndEmit($event, 'delete')"
        >
          <ds-icon name="trash2" class="actionIcon" />
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./poi-item.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DsPoiItemComponent {
  @Input() id!: string;
  @Input() name!: string;
  @Input() category!: CategoryId;
  @Input() lat!: number;
  @Input() lng!: number;
  @Input() selected = false;

  @Output() onClick = new EventEmitter<string>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  color = computed(() => CATEGORY_COLORS[this.category]);
  iconName = computed(() => CATEGORY_ICONS[this.category]);
  badgeBackground = computed(() => {
    const color = this.color();
    return `color-mix(in oklab, ${color} 18%, transparent)`;
  });

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onClick.emit(this.id);
    }
  }

  stopPropagationAndEmit(event: Event, action: 'edit' | 'delete'): void {
    event.stopPropagation();
    if (action === 'edit') {
      this.edit.emit(this.id);
    } else {
      this.delete.emit(this.id);
    }
  }
}
