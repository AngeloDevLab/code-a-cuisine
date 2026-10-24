import { NgOptimizedImage } from '@angular/common';
import { Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { cuisineLabel } from '../../models/generator-options';
import { Cuisine } from '../../models/recipe-request';
import { RecipeService } from '../../services/recipe-service';
import { BackLink } from '../../shared/back-link/back-link';
import { Button } from '../../shared/button/button';
import { Logo } from '../../shared/logo/logo';

const CUISINE_ORDER: Cuisine[] = ['italian', 'german', 'japanese', 'gourmet', 'indian', 'fusion'];

/** Entry page of the public cookbook with the most liked recipes and all cuisines. */
@Component({
  imports: [BackLink, Button, Logo, NgOptimizedImage, RouterLink],
  selector: 'app-cookbook',
  styleUrl: './cookbook.scss',
  templateUrl: './cookbook.html',
})
export class Cookbook {
  private readonly recipeService = inject(RecipeService);

  protected readonly cuisines = CUISINE_ORDER.map((value) => ({ value, label: cuisineLabel(value) }));

  protected readonly topRecipes = resource({
    defaultValue: [],
    loader: () => this.recipeService.getMostLiked(),
  });
}
