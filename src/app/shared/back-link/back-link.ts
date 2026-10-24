import { NgTemplateOutlet } from '@angular/common';
import { Component, booleanAttribute, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BackNavigation } from '../../services/back-navigation';

/** Small back link under the logo, steps back through the history or links to a fixed page. */
@Component({
  imports: [NgTemplateOutlet, RouterLink],
  selector: 'app-back-link',
  styleUrl: './back-link.scss',
  template: `
    @if (history()) {
      <button class="back-link" type="button" [attr.aria-label]="ariaLabel()" (click)="goBack()">
        <ng-container [ngTemplateOutlet]="content" />
      </button>
    } @else {
      <a class="back-link" [routerLink]="target()" [attr.aria-label]="ariaLabel()">
        <ng-container [ngTemplateOutlet]="content" />
      </a>
    }

    <ng-template #content>
      <span class="back-link__icon" aria-hidden="true"></span>
      <span class="back-link__label">{{ label() }}</span>
    </ng-template>
  `,
})
export class BackLink {
  private readonly backNavigation = inject(BackNavigation);

  readonly target = input.required<string>();
  readonly label = input('Back');
  readonly history = input(true, { transform: booleanAttribute });

  protected readonly ariaLabel = computed(() => (this.label() === 'Back' ? 'Back' : `Back to ${this.label()}`));

  /** Returns to the previous page, or to the target if this page was opened directly. */
  protected goBack(): void {
    this.backNavigation.back(this.target());
  }
}
