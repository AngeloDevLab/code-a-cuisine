import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';

const ICON_WIDTHS = [28, 25, 22, 15];

/** Colored label with icon for one cook. */
@Component({
  imports: [NgOptimizedImage],
  selector: 'app-chef-badge',
  styleUrl: './chef-badge.scss',
  host: { '[class]': "'chef-badge--' + cook()" },
  template: `
    <img [ngSrc]="'icons/chef-' + cook() + '.svg'" alt="" [width]="iconWidth()"
      height="22" />
    Chef {{ cook() }}
  `,
})
export class ChefBadge {
  readonly cook = input.required<number>();

  protected readonly iconWidth = computed(() => ICON_WIDTHS[this.cook() - 1]);
}
