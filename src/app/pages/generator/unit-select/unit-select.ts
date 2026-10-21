import { Component, computed, model, signal } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { UNIT_OPTIONS } from '../../../models/generator-options';
import { Unit } from '../../../models/recipe-request';

let nextId = 0;

/** Unit picker whose options open inline below the field instead of a native dropdown. */
@Component({
  selector: 'app-unit-select',
  styleUrl: './unit-select.scss',
  template: `
    <button class="unit-select__toggle" type="button" [attr.aria-label]="'Unit: ' + label()"
      [attr.aria-controls]="optionsId" [attr.aria-expanded]="open()" (click)="open.set(!open())">
      {{ label() }}
      <span class="unit-select__arrow" [class.unit-select__arrow--open]="open()" aria-hidden="true"></span>
    </button>
    <div class="unit-select__options" [id]="optionsId" [class.unit-select__options--open]="open()"
      [attr.inert]="open() ? null : ''">
      <ul class="unit-select__list">
        @for (unit of units; track unit.value) {
          <li>
            <button class="unit-select__option" type="button" [attr.aria-pressed]="unit.value === value()"
              (click)="select(unit.value)">
              {{ unit.label }}
            </button>
          </li>
        }
      </ul>
    </div>
  `,
  host: { '(keydown.escape)': 'open.set(false)' },
})
export class UnitSelect implements FormValueControl<Unit> {
  readonly value = model<Unit>('g');

  protected readonly units = UNIT_OPTIONS;
  protected readonly optionsId = `unit-select-options-${nextId++}`;
  protected readonly open = signal(false);
  protected readonly label = computed(() => UNIT_OPTIONS.find((u) => u.value === this.value())?.label);

  /** Sets the chosen unit and closes the options. */
  protected select(unit: Unit): void {
    this.value.set(unit);
    this.open.set(false);
  }
}
