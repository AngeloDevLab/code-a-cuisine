import { NgOptimizedImage } from '@angular/common';
import { Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CUISINE_OPTIONS } from '../../models/generator-options';
import { Cuisine } from '../../models/recipe-request';
import { BackNavigation } from '../../services/back-navigation';
import { RecipeService } from '../../services/recipe-service';
import { Logo } from '../../shared/logo/logo';

const CUISINE_ORDER: Cuisine[] = ['italian', 'german', 'japanese', 'gourmet', 'indian', 'fusion'];

/** Entry page of the public cookbook with the most liked recipes and all cuisines. */
@Component({
  imports: [Logo, NgOptimizedImage, RouterLink],
  selector: 'app-cookbook',
  styleUrl: './cookbook.scss',
  templateUrl: './cookbook.html',
})
export class Cookbook {
  private readonly recipeService = inject(RecipeService);
  private readonly backNavigation = inject(BackNavigation);

  protected readonly cuisines = CUISINE_ORDER.map((value) => ({
    value,
    label: CUISINE_OPTIONS.find((option) => option.value === value)?.label ?? value,
  }));

  protected readonly topRecipes = resource({
    defaultValue: [],
    loader: () => this.recipeService.getMostLiked(),
  });

  /** Returns to the previous page, or to the start page if the cookbook was opened directly. */
  protected goBack(): void {
    this.backNavigation.back('/');
  }
}
