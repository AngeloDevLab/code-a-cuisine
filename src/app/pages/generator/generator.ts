import { Component, ElementRef, Injector, afterNextRender, computed, inject, signal, viewChild } from '@angular/core';
import { FieldTree, FormField, form, max, maxLength, validate } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { INGREDIENT_LIMITS } from '../../constants/limits';
import { Ingredient, Unit } from '../../models/ingredient';
import { GeneratorStore } from '../../services/generator-store';
import { Button } from '../../shared/button/button';
import { LegalLinks } from '../../shared/legal-links/legal-links';
import { Logo } from '../../shared/logo/logo';
import { findSuggestions } from '../../utils/ingredient-suggestions';
import { formatAmount } from '../../utils/labels';
import { positiveAmount } from '../../utils/validators';
import { UnitSelect } from './unit-select/unit-select';

interface IngredientDraft {
  name: string;
  amount: number | null;
  unit: Unit;
}

type AmountDraft = Omit<IngredientDraft, 'name'>;

const EMPTY_DRAFT: IngredientDraft = { name: '', amount: null, unit: 'g' };
const NAME_FLY_DURATION = 300;

/** First generator step where the user collects the ingredients they have. */
@Component({
  imports: [Button, FormField, LegalLinks, Logo, RouterLink, UnitSelect],
  selector: 'app-generator',
  styleUrl: './generator.scss',
  templateUrl: './generator.html',
})
export class Generator {
  protected readonly store = inject(GeneratorStore);
  private readonly injector = inject(Injector);

  private readonly draft = signal<IngredientDraft>(EMPTY_DRAFT);
  protected readonly ingredientForm = form(this.draft, (path) => {
    validate(path.name, ({ value }) => (value().trim() ? undefined : { kind: 'required' }));
    maxLength(path.name, INGREDIENT_LIMITS.nameMaxLength);
    validate(path.amount, positiveAmount);
    max(path.amount, INGREDIENT_LIMITS.amountMax);
  });

  private readonly suggestionsOpen = signal(false);
  protected readonly activeSuggestion = signal(-1);
  protected readonly suggestions = computed(() =>
    this.suggestionsOpen() ? findSuggestions(this.draft().name) : [],
  );

  protected readonly editingIndex = signal<number | null>(null);
  private readonly editDraft = signal<AmountDraft>({ amount: null, unit: 'g' });
  protected readonly editForm = form(this.editDraft, (path) => {
    validate(path.amount, positiveAmount);
    max(path.amount, INGREDIENT_LIMITS.amountMax);
  });
  private readonly editAmount = viewChild<ElementRef<HTMLInputElement>>('editAmount');
  private readonly editName = viewChild<ElementRef<HTMLElement>>('editName');

  /**
   * Adds the drafted ingredient to the list and clears the form.
   * @param event - The submit event of the form.
   */
  protected addIngredient(event: Event): void {
    event.preventDefault();
    const { name, amount, unit } = this.draft();
    if (this.ingredientForm().invalid() || amount === null) return;
    this.store.addIngredient({ name: name.trim(), amount, unit });
    this.ingredientForm().reset(EMPTY_DRAFT);
  }

  /**
   * Sets an amount above the maximum back to the maximum while the user types, in the input and the form.
   * @param field - The form field of the amount.
   * @param event - The input event of the amount field.
   */
  protected clampAmount(field: FieldTree<number | null>, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!(input.valueAsNumber > INGREDIENT_LIMITS.amountMax)) return;
    input.value = String(INGREDIENT_LIMITS.amountMax);
    field().value.set(INGREDIENT_LIMITS.amountMax);
  }

  /**
   * Formats the amount for the ingredient list; pieces show the bare number, e.g. "2 Eggs".
   * @param ingredient - The ingredient with its amount and unit.
   * @returns The amount as display text.
   */
  protected listAmount({ amount, unit }: Ingredient): string {
    return unit === 'pcs' ? `${amount}` : formatAmount(amount, unit);
  }

  /** Shows suggestions for the current input without a highlighted entry. */
  protected openSuggestions(): void {
    this.suggestionsOpen.set(true);
    this.activeSuggestion.set(-1);
  }

  /** Hides the suggestion list. */
  protected closeSuggestions(): void {
    this.suggestionsOpen.set(false);
    this.activeSuggestion.set(-1);
  }

  /**
   * Takes over a suggestion as the ingredient name.
   * @param name - The picked ingredient name.
   */
  protected pickSuggestion(name: string): void {
    this.ingredientForm.name().value.set(name);
    this.closeSuggestions();
  }

  /**
   * Handles arrow keys, Enter and Escape while suggestions are shown.
   * @param event - The keydown event of the name field.
   */
  protected onNameKeydown(event: KeyboardEvent): void {
    const count = this.suggestions().length;
    if (!count) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = this.activeSuggestion() + (event.key === 'ArrowDown' ? 1 : -1);
      this.activeSuggestion.set(next < 0 ? count - 1 : next % count);
    } else if (event.key === 'Enter' && this.activeSuggestion() >= 0) {
      event.preventDefault();
      this.pickSuggestion(this.suggestions()[this.activeSuggestion()]);
    } else if (event.key === 'Escape') {
      this.closeSuggestions();
    }
  }

  /**
   * Switches a list item into edit mode, lets its name fly to the new spot and focuses the amount.
   * @param index - The index of the ingredient to edit.
   * @param name - The name element in the list, used as the start of the animation.
   */
  protected startEdit(index: number, name: HTMLElement): void {
    const from = name.getBoundingClientRect();
    const { amount, unit } = this.store.ingredients()[index];
    this.editForm().reset({ amount, unit });
    this.editingIndex.set(index);
    afterNextRender(
      () => {
        this.flyName(from);
        this.editAmount()?.nativeElement.focus();
      },
      { injector: this.injector },
    );
  }

  /**
   * Animates the edit name from its previous position to where it is rendered now.
   * @param from - The position of the name before the switch.
   */
  private flyName(from: DOMRect): void {
    const target = this.editName()?.nativeElement;
    if (!target || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const to = target.getBoundingClientRect();
    target.animate(
      [{ translate: `${from.left - to.left}px ${from.top - to.top}px` }, { translate: '0 0' }],
      { duration: NAME_FLY_DURATION, easing: 'ease-in-out' },
    );
  }

  /**
   * Saves the edited amount and unit and leaves edit mode.
   * @param event - The submit event of the edit form.
   * @param index - The index of the edited ingredient.
   */
  protected saveEdit(event: Event, index: number): void {
    event.preventDefault();
    const { amount, unit } = this.editDraft();
    if (this.editForm().invalid() || amount === null) return;
    this.store.updateIngredient(index, { amount, unit });
    this.editingIndex.set(null);
  }

  /**
   * Removes an ingredient and ends any running edit, since the indexes shift.
   * @param index - The index of the ingredient to remove.
   */
  protected deleteIngredient(index: number): void {
    this.store.removeIngredient(index);
    this.editingIndex.set(null);
  }
}
