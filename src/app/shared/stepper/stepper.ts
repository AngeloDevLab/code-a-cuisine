import { Component, computed, input, model } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';

/** Number control with minus and plus buttons, usable with `[formField]`. */
@Component({
  selector: 'app-stepper',
  styleUrl: './stepper.scss',
  template: `
    <button class="stepper__button" type="button" [attr.aria-label]="'Fewer ' + unit()"
      [disabled]="!canDecrease()" (click)="step(-1)">
      <span class="stepper__icon stepper__icon--decrease" aria-hidden="true"></span>
    </button>
    <output class="stepper__value" aria-live="polite">{{ value() }}</output>
    <span class="stepper__unit">{{ unit() }}</span>
    <button class="stepper__button" type="button" [attr.aria-label]="'More ' + unit()"
      [disabled]="!canIncrease()" (click)="step(1)">
      <span class="stepper__icon stepper__icon--increase" aria-hidden="true"></span>
    </button>
  `,
  host: { class: 'stepper', role: 'group' },
})
export class Stepper implements FormValueControl<number> {
  readonly value = model(0);
  readonly min = input<number>();
  readonly max = input<number>();
  readonly unit = input.required<string>();

  protected readonly canDecrease = computed(() => this.value() > (this.min() ?? -Infinity));
  protected readonly canIncrease = computed(() => this.value() < (this.max() ?? Infinity));

  /** Changes the value by the given delta. */
  protected step(delta: number): void {
    this.value.update((current) => current + delta);
  }
}
