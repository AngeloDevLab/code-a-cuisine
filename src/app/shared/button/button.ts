import { Component, booleanAttribute, input } from '@angular/core';

export type ButtonVariant = 'filled' | 'text';
export type ButtonTone = 'green' | 'creamy';

/** Shared call to action look for links and buttons, filled or as text, in green or creamy. */
@Component({
  selector: 'a[appButton], button[appButton]',
  styleUrl: './button.scss',
  host: {
    class: 'button',
    '[class.button--text]': "variant() === 'text'",
    '[class.button--creamy]': "tone() === 'creamy'",
  },
  template: `
    <span class="button__label" [attr.data-label]="label()">{{ label() }}</span>
    @if (arrow()) {
      <span class="button__arrow" aria-hidden="true"></span>
    }
  `,
})
export class Button {
  readonly label = input.required<string>();
  readonly variant = input<ButtonVariant>('filled');
  readonly tone = input<ButtonTone>('green');
  readonly arrow = input(false, { transform: booleanAttribute });
}
