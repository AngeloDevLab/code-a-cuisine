import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RecipeStore } from '../../services/recipe-store';
import { Logo } from '../../shared/logo/logo';
import { RecipeIngredients } from './recipe-ingredients/recipe-ingredients';
import { RecipeLike } from './recipe-like/recipe-like';
import { RecipeSteps } from './recipe-steps/recipe-steps';
import { RecipeSummary } from './recipe-summary/recipe-summary';

/** Full view of one recipe with ingredients, steps, nutrition and likes. */
@Component({
  imports: [Logo, RecipeIngredients, RecipeLike, RecipeSteps, RecipeSummary, RouterLink],
  selector: 'app-recipe-detail',
  styleUrl: './recipe-detail.scss',
  templateUrl: './recipe-detail.html',
})
export class RecipeDetail {
  private readonly recipeStore = inject(RecipeStore);

  readonly id = input.required<string>();

  protected readonly recipe = computed(() => this.recipeStore.recipes().find((recipe) => recipe.id === this.id()));
}
