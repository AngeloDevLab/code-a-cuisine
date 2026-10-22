import { Component, input, model } from '@angular/core';

/** Mobile-only button that shows or hides a recipe section. */
@Component({
  selector: 'app-section-toggle',
  styleUrl: './section-toggle.scss',
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
  readonly expanded = model(true);
}
