import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { DsButtonComponent } from '../button/button.component';
import { DsPoiItemComponent } from '../poi-item/poi-item.component';
import { DsCategoryChipComponent } from '../category-chip/category-chip.component';
import { DsIconComponent } from '../icon/icon.component';
import type { SidebarPoi, SidebarCategory } from '../../utils/category-types';

@Component({
  selector: 'ds-sidebar',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, DsButtonComponent, DsPoiItemComponent, DsCategoryChipComponent, DsIconComponent],
  template: `
    <aside
      class="sidebar"
      [style.width]="collapsed ? '0' : 'var(--ds-sidebar-width)'"
      aria-label="POI list"
      [attr.aria-expanded]="!collapsed"
    >
      <button
        type="button"
        class="toggle"
        (click)="toggle.emit()"
        [attr.aria-label]="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <ds-icon
          [name]="collapsed ? 'chevron-right' : 'chevron-left'"
          [size]="16"
          class="toggleIcon"
          aria-hidden="true"
        />
      </button>

      <div class="inner" *ngIf="!collapsed">
        <div class="newBtnWrapper">
          <ds-button variant="primary" size="md" class="newBtn" (click)="new.emit()">
            <ds-icon name="plus" [size]="16" aria-hidden="true" />
            New POI
          </ds-button>
        </div>

        <div class="sectionHeader">
          <h2 class="sectionLabel">POIs</h2>
          <span class="sectionCount" aria-live="polite">
            {{ pois.length }}
          </span>
        </div>

        <div role="list" class="list">
          <div *ngIf="pois.length === 0" class="emptyState">
            No points yet.<br />Click the map or "New POI".
          </div>
          <div class="listItems" *ngIf="pois.length > 0">
            <ds-poi-item
              *ngFor="let poi of pois"
              [id]="poi.id"
              [name]="poi.name"
              [category]="poi.category"
              [lat]="poi.lat"
              [lng]="poi.lng"
              [selected]="poi.selected ?? false"
              (onClick)="focus.emit($event)"
              (edit)="edit.emit($event)"
              (delete)="delete.emit($event)"
            />
          </div>
        </div>

        <div class="categories">
          <h2 class="sectionLabel">Categories</h2>
          <div class="chips">
            <ds-category-chip
              *ngFor="let cat of categories"
              [category]="cat.id"
              [label]="cat.label"
            />
          </div>
        </div>
      </div>
    </aside>
  `,
  styleUrls: ['./sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DsSidebarComponent {
  @Input() pois: SidebarPoi[] = [];
  @Input() categories: SidebarCategory[] = [];
  @Input() collapsed = false;

  @Output() toggle = new EventEmitter<void>();
  @Output() new = new EventEmitter<void>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() focus = new EventEmitter<string>();
}
