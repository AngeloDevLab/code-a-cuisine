import { Service, computed, signal } from '@angular/core';
import { INGREDIENT_LIMITS } from '../constants/limits';
import { Ingredient } from '../models/ingredient';
import { Preferences } from '../models/preferences';
import { RecipeRequest } from '../models/recipe-request';

const DEFAULT_PREFERENCES: Preferences = {
  portions: 2,
  cooks: 1,
  cookingTime: 'quick',
  cuisine: 'italian',
  diet: 'none',
};

/** Holds the generator input shared between the ingredients and preferences steps. */
@Service()
export class GeneratorStore {
  readonly ingredients = signal<Ingredient[]>([]);
  readonly preferences = signal<Preferences>(DEFAULT_PREFERENCES);

  readonly hasIngredients = computed(() => this.ingredients().length >= INGREDIENT_LIMITS.min);
  readonly isFull = computed(() => this.ingredients().length >= INGREDIENT_LIMITS.max);
  readonly request = computed<RecipeRequest>(() => ({
    ingredients: this.ingredients(),
    ...this.preferences(),
  }));

  /**
   * Adds an ingredient unless the list is already full.
   * @param ingredient - The ingredient to add.
   */
  addIngredient(ingredient: Ingredient): void {
    if (this.isFull()) return;
    this.ingredients.update((list) => [...list, ingredient]);
  }

  /**
   * Merges the given changes into the ingredient at the given index.
   * @param index - The index of the ingredient.
   * @param changes - The fields to overwrite.
   */
  updateIngredient(index: number, changes: Partial<Ingredient>): void {
    this.ingredients.update((list) => list.map((item, i) => (i === index ? { ...item, ...changes } : item)));
  }

  /**
   * Removes the ingredient at the given index.
   * @param index - The index of the ingredient.
   */
  removeIngredient(index: number): void {
    this.ingredients.update((list) => list.filter((_, i) => i !== index));
  }

  /** Resets all input to its defaults. */
  reset(): void {
    this.ingredients.set([]);
    this.preferences.set(DEFAULT_PREFERENCES);
  }
}
