import { Component, computed, inject, input, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUISINE_BANNERS } from '../../data/cuisine-banners';
import { cuisineLabel, recipeTags } from '../../models/generator-options';
import { Cuisine } from '../../models/recipe-request';
import { CookbookService, RECIPES_PER_PAGE } from '../../services/cookbook-service';
import { BackLink } from '../../shared/back-link/back-link';
import { Button } from '../../shared/button/button';
import { LegalLinks } from '../../shared/legal-links/legal-links';
import { Logo } from '../../shared/logo/logo';
import { Pagination } from '../../shared/pagination/pagination';

/** Paginated list of the cookbook recipes of one cuisine. */
@Component({
  imports: [BackLink, Button, LegalLinks, Logo, Pagination, RouterLink],
  selector: 'app-recipe-list',
  styleUrl: './recipe-list.scss',
  templateUrl: './recipe-list.html',
})
export class RecipeList {
  private readonly cookbook = inject(CookbookService);

  readonly cuisine = input.required<Cuisine>();
  readonly page = input<string>();

  protected readonly label = computed(() => cuisineLabel(this.cuisine()));
  protected readonly banner = computed(() => CUISINE_BANNERS[this.cuisine()]);

  protected readonly result = resource({
    params: () => ({ cuisine: this.cuisine(), page: Number(this.page()) || 1 }),
    loader: ({ params }) => this.cookbook.getByCuisine(params.cuisine, params.page),
  });

  protected readonly loadedPage = computed(() => (this.result.hasValue() ? this.result.value() : undefined));

  protected readonly firstNumber = computed(() => ((this.loadedPage()?.page ?? 1) - 1) * RECIPES_PER_PAGE + 1);

  protected readonly items = computed(() =>
    (this.loadedPage()?.recipes ?? []).map((recipe) => ({ ...recipe, tags: recipeTags(recipe) })),
  );
}
