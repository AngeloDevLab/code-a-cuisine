import { Component, computed, input } from '@angular/core';
import { Recipe } from '../../../models/recipe';
import { recipeTags } from '../../../utils/labels';
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

  protected readonly tags = computed(() => recipeTags(this.recipe()));
}
