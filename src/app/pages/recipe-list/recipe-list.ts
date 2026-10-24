import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUISINE_BANNERS } from '../../data/cuisine-banners';
import { COOKING_TIME_OPTIONS, DIET_OPTIONS, cuisineLabel } from '../../models/generator-options';
import { RecipePreview } from '../../models/recipe';
import { Cuisine } from '../../models/recipe-request';
import { BackNavigation } from '../../services/back-navigation';
import { RECIPES_PER_PAGE, RecipeService } from '../../services/recipe-service';
import { Logo } from '../../shared/logo/logo';
import { Pagination } from '../../shared/pagination/pagination';

/** Paginated list of the cookbook recipes of one cuisine. */
@Component({
  imports: [Logo, NgOptimizedImage, Pagination, RouterLink],
  selector: 'app-recipe-list',
  styleUrl: './recipe-list.scss',
  templateUrl: './recipe-list.html',
})
export class RecipeList {
  private readonly recipeService = inject(RecipeService);
  private readonly backNavigation = inject(BackNavigation);

  readonly cuisine = input.required<Cuisine>();
  readonly page = input<string>();

  protected readonly label = computed(() => cuisineLabel(this.cuisine()));
  protected readonly banner = computed(() => CUISINE_BANNERS[this.cuisine()]);

  protected readonly result = resource({
    params: () => ({ cuisine: this.cuisine(), page: Number(this.page()) || 1 }),
    loader: ({ params }) => this.recipeService.getByCuisine(params.cuisine, params.page),
  });

  protected readonly firstNumber = computed(() => ((this.result.value()?.page ?? 1) - 1) * RECIPES_PER_PAGE + 1);

  protected readonly items = computed(() =>
    (this.result.value()?.recipes ?? []).map((recipe) => ({ ...recipe, tags: toTags(recipe) })),
  );

  /** Returns to the previous page, or to the cookbook if the list was opened directly. */
  protected goBack(): void {
    this.backNavigation.back('/cookbook');
  }
}

/** Collects the diet and cooking time labels shown as tags. */
function toTags(recipe: RecipePreview): string[] {
  const diet = recipe.diet === 'none' ? undefined : DIET_OPTIONS.find((option) => option.value === recipe.diet);
  const time = COOKING_TIME_OPTIONS.find((option) => option.value === recipe.cookingTime);
  return [diet?.label, time?.label].filter((label) => label !== undefined);
}
