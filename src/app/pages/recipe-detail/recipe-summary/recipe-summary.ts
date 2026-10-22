import { Component, computed, input } from '@angular/core';
import { COOKING_TIME_OPTIONS, DIET_OPTIONS } from '../../../models/generator-options';
import { Recipe } from '../../../models/recipe';
import { ChefBadge } from '../chef-badge/chef-badge';
import { NutritionFacts } from '../nutrition-facts/nutrition-facts';

/** Top card of a recipe with time, title, cooks, tags and nutrition. */
@Component({
  imports: [ChefBadge, NutritionFacts],
  selector: 'app-recipe-summary',
  styleUrl: './recipe-summary.scss',
  templateUrl: './recipe-summary.html',
})
export class RecipeSummary {
  readonly recipe = input.required<Recipe>();

  protected readonly cooks = computed(() => Array.from({ length: this.recipe().cooks }, (_, index) => index + 1));

  protected readonly tags = computed(() => {
    const { diet, cookingTime } = this.recipe();
    return [
      diet === 'none' ? undefined : DIET_OPTIONS.find((option) => option.value === diet)?.label,
      COOKING_TIME_OPTIONS.find((option) => option.value === cookingTime)?.label,
    ].filter((label) => label !== undefined);
  });
}
