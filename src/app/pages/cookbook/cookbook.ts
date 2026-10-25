import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { cuisineLabel } from '../../models/generator-options';
import { Cuisine } from '../../models/recipe-request';
import { CookbookService, TOP_RECIPE_LIMIT } from '../../services/cookbook-service';
import { BackLink } from '../../shared/back-link/back-link';
import { Button } from '../../shared/button/button';
import { LegalLinks } from '../../shared/legal-links/legal-links';
import { Logo } from '../../shared/logo/logo';

const CUISINE_ORDER: Cuisine[] = ['italian', 'german', 'japanese', 'gourmet', 'indian', 'fusion'];

/** Entry page of the public cookbook with the most liked recipes and all cuisines. */
@Component({
  imports: [BackLink, Button, LegalLinks, Logo, NgOptimizedImage, RouterLink],
  selector: 'app-cookbook',
  styleUrl: './cookbook.scss',
  templateUrl: './cookbook.html',
})
export class Cookbook {
  private readonly cookbook = inject(CookbookService);

  protected readonly cuisines = CUISINE_ORDER.map((value) => ({ value, label: cuisineLabel(value) }));

  protected readonly placeholders = Array.from({ length: TOP_RECIPE_LIMIT }, (_, index) => index);

  protected readonly topRecipes = resource({
    defaultValue: [],
    loader: () => this.cookbook.getMostLiked(),
  });

  protected readonly mostLiked = computed(() => (this.topRecipes.hasValue() ? this.topRecipes.value() : []));
}
