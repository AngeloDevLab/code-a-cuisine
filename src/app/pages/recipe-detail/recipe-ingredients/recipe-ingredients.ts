import { Component, input, signal } from '@angular/core';
import { formatAmount } from '../../../models/generator-options';
import { Recipe } from '../../../models/recipe';
import { Ingredient } from '../../../models/recipe-request';
import { SectionBanner } from '../section-banner/section-banner';
import { SectionToggle } from '../section-toggle/section-toggle';

/** Lists the user's ingredients and the extra ones the recipe needs. */
@Component({
  imports: [SectionBanner, SectionToggle],
  selector: 'app-recipe-ingredients',
  styleUrl: './recipe-ingredients.scss',
  templateUrl: './recipe-ingredients.html',
})
export class RecipeIngredients {
  readonly recipe = input.required<Recipe>();

  protected readonly expanded = signal(true);

  /** Formats the amount with its unit, e.g. "80g" or "2 pieces". */
  protected amount(ingredient: Ingredient): string {
    return formatAmount(ingredient.amount, ingredient.unit);
  }
}
