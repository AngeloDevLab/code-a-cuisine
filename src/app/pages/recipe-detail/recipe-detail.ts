import { Component, computed, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUISINE_OPTIONS } from '../../models/generator-options';
import { CookbookService } from '../../services/cookbook-service';
import { LikeStore } from '../../services/like-store';
import { RecipeStore } from '../../services/recipe-store';
import { BackLink } from '../../shared/back-link/back-link';
import { Button } from '../../shared/button/button';
import { Logo } from '../../shared/logo/logo';
import { RecipeIngredients } from './recipe-ingredients/recipe-ingredients';
import { RecipeLike } from './recipe-like/recipe-like';
import { RecipeSteps } from './recipe-steps/recipe-steps';
import { RecipeSummary } from './recipe-summary/recipe-summary';

interface BackTarget {
  path: string;
  label: string;
}

/** Full view of one recipe with ingredients, steps, nutrition and likes. */
@Component({
  imports: [BackLink, Button, Logo, RecipeIngredients, RecipeLike, RecipeSteps, RecipeSummary, RouterLink],
  selector: 'app-recipe-detail',
  styleUrl: './recipe-detail.scss',
  templateUrl: './recipe-detail.html',
})
export class RecipeDetail {
  private readonly recipeStore = inject(RecipeStore);
  private readonly cookbook = inject(CookbookService);
  private readonly likeStore = inject(LikeStore);

  readonly id = input.required<string>();

  readonly from = input<string>();

  private readonly generated = computed(() => this.recipeStore.recipes().find((recipe) => recipe.id === this.id()));

  protected readonly loaded = resource({
    params: () => (this.generated() ? undefined : this.id()),
    loader: ({ params }) => this.cookbook.getById(params),
  });

  private readonly current = computed(() => this.generated() ?? (this.loaded.hasValue() ? this.loaded.value() : null));

  protected readonly recipe = computed(() => {
    const recipe = this.current();
    const likes = recipe ? this.likeStore.counts()[recipe.id] : undefined;
    return recipe && likes !== undefined ? { ...recipe, likes } : recipe;
  });
  protected readonly back = computed(() => toBackTarget(this.from()));
}

/** Maps the from query param to the page the back link returns to. */
function toBackTarget(from: string | undefined): BackTarget {
  if (from === 'cookbook') {
    return { path: '/cookbook', label: 'Cookbook' };
  }
  const cuisine = CUISINE_OPTIONS.find((option) => option.value === from);
  if (cuisine) {
    return { path: `/cookbook/${cuisine.value}`, label: `${cuisine.label} cuisine` };
  }
  return { path: '/results', label: 'Recipe results' };
}
