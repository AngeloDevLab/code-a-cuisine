import { Component, computed, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUISINE_BANNERS } from '../../data/cuisine-banners';
import { cuisineLabel, recipeTags } from '../../models/generator-options';
import { Cuisine } from '../../models/recipe-request';
import { RECIPES_PER_PAGE, RecipeService } from '../../services/recipe-service';
import { BackLink } from '../../shared/back-link/back-link';
import { Button } from '../../shared/button/button';
import { Logo } from '../../shared/logo/logo';
import { Pagination } from '../../shared/pagination/pagination';

/** Paginated list of the cookbook recipes of one cuisine. */
@Component({
  imports: [BackLink, Button, Logo, Pagination, RouterLink],
  selector: 'app-recipe-list',
  styleUrl: './recipe-list.scss',
  templateUrl: './recipe-list.html',
})
export class RecipeList {
  private readonly recipeService = inject(RecipeService);

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
    (this.result.value()?.recipes ?? []).map((recipe) => ({ ...recipe, tags: recipeTags(recipe) })),
  );
}
