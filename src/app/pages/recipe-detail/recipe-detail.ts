import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUISINE_OPTIONS } from '../../models/generator-options';
import { BackNavigation } from '../../services/back-navigation';
import { RecipeStore } from '../../services/recipe-store';
import { Logo } from '../../shared/logo/logo';
import { RecipeIngredients } from './recipe-ingredients/recipe-ingredients';
import { RecipeLike } from './recipe-like/recipe-like';
import { RecipeSteps } from './recipe-steps/recipe-steps';
import { RecipeSummary } from './recipe-summary/recipe-summary';

interface BackLink {
  path: string;
  label: string;
}

/** Full view of one recipe with ingredients, steps, nutrition and likes. */
@Component({
  imports: [Logo, RecipeIngredients, RecipeLike, RecipeSteps, RecipeSummary, RouterLink],
  selector: 'app-recipe-detail',
  styleUrl: './recipe-detail.scss',
  templateUrl: './recipe-detail.html',
})
export class RecipeDetail {
  private readonly recipeStore = inject(RecipeStore);
  private readonly backNavigation = inject(BackNavigation);

  readonly id = input.required<string>();

  readonly from = input<string>();

  protected readonly recipe = computed(() => this.recipeStore.recipes().find((recipe) => recipe.id === this.id()));
  protected readonly back = computed(() => toBackLink(this.from()));

  /** Returns to the page the recipe was opened from. */
  protected goBack(): void {
    this.backNavigation.back(this.back().path);
  }
}

/** Maps the from query param to the page the back link returns to. */
function toBackLink(from: string | undefined): BackLink {
  if (from === 'cookbook') {
    return { path: '/cookbook', label: 'Cookbook' };
  }
  const cuisine = CUISINE_OPTIONS.find((option) => option.value === from);
  if (cuisine) {
    return { path: `/cookbook/${cuisine.value}`, label: `${cuisine.label} cuisine` };
  }
  return { path: '/results', label: 'Recipe results' };
}
