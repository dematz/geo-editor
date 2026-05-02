import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import type { IconName } from '../../utils/category-types';

@Component({
  selector: 'ds-icon',
  standalone: true,
  imports: [NgSwitch, NgSwitchCase],
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [ngSwitch]="name"
      role="img"
      [attr.aria-label]="name"
    >
      <g *ngSwitchCase="'map-pinned'">
        <path d="M21.5 2v6h-6M3 13.5a9 9 0 0 1 15-6.7L21.5 2M2 2h7v7M2 13.5a9 9 0 0 0 20.1-4.3" />
      </g>
      <g *ngSwitchCase="'search'">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </g>
      <g *ngSwitchCase="'upload'">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </g>
      <g *ngSwitchCase="'download'">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </g>
      <g *ngSwitchCase="'undo2'">
        <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
        <path d="M9 14 4 9l5-5" />
      </g>
      <g *ngSwitchCase="'redo2'">
        <path d="m15 14 5-5-5-5" />
        <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13" />
      </g>
      <g *ngSwitchCase="'trash2'">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
      </g>
      <g *ngSwitchCase="'plus'">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </g>
      <g *ngSwitchCase="'chevron-left'">
        <polyline points="15 18 9 12 15 6" />
      </g>
      <g *ngSwitchCase="'chevron-right'">
        <polyline points="9 18 15 12 9 6" />
      </g>
      <g *ngSwitchCase="'pencil'">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
      </g>
      <g *ngSwitchCase="'x'">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </g>
      <g *ngSwitchCase="'chevron-down'">
        <polyline points="6 9 12 15 18 9" />
      </g>
      <g *ngSwitchCase="'utensils'">
        <path d="M3 2v7c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V2M7 2v7M21 8l-7-7-7 7M5.03 7H7c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-4" />
      </g>
      <g *ngSwitchCase="'hotel'">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <path d="M2 9h20M6 6v3M10 6v3M14 6v3M18 6v3" />
        <rect x="5" y="14" width="3" height="4" />
        <rect x="11" y="14" width="3" height="4" />
        <rect x="16" y="14" width="3" height="4" />
      </g>
      <g *ngSwitchCase="'trees'">
        <path d="M12 2L2 7v5h8v5H5v4h14v-4h-5v-5h8V7l-10-5z" />
        <path d="M7 9h10" />
        <path d="M9 13h6" />
      </g>
      <g *ngSwitchCase="'cross'">
        <path d="M11 2v20M2 11h20" />
      </g>
      <g *ngSwitchCase="'map-pin'">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </g>
    </svg>
  `,
  styles: [':host { display: inline-flex; align-items: center; justify-content: center; }'],
  encapsulation: ViewEncapsulation.None,
})
export class DsIconComponent {
  @Input() name!: IconName;
  @Input() size = 16;
}
