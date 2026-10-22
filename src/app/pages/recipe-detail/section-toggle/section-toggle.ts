import { Component, booleanAttribute, input, model } from '@angular/core';

/** Button that shows or hides a recipe section, by default only on mobile. */
@Component({
  selector: 'app-section-toggle',
  styleUrl: './section-toggle.scss',
  host: { '[class.section-toggle--always]': 'alwaysVisible()' },
  template: `
    <button class="section-toggle" type="button" [attr.aria-expanded]="expanded()" [attr.aria-controls]="controls()"
      (click)="expanded.set(!expanded())">
      {{ expanded() ? 'Hide' : 'Show' }} {{ label() }}
      <span class="section-toggle__icon" [class.section-toggle__icon--up]="expanded()" aria-hidden="true"></span>
    </button>
  `,
})
export class SectionToggle {
  readonly label = input.required<string>();
  readonly controls = input.required<string>();
  readonly alwaysVisible = input(false, { transform: booleanAttribute });
  readonly expanded = model(true);
}
