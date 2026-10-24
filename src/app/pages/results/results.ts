import { NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COOKING_TIME_OPTIONS, cuisineLabel } from '../../models/generator-options';
import { GeneratorStore } from '../../services/generator-store';
import { RecipeStore } from '../../services/recipe-store';
import { Button } from '../../shared/button/button';
import { Logo } from '../../shared/logo/logo';

/** Shows the three generated recipes with links to their details. */
@Component({
  imports: [Button, Logo, NgOptimizedImage, RouterLink],
  selector: 'app-results',
  styleUrl: './results.scss',
  templateUrl: './results.html',
})
export class Results {
  private readonly generatorStore = inject(GeneratorStore);
  protected readonly recipes = inject(RecipeStore).recipes;

  protected readonly tags = computed(() => {
    const { cuisine, cookingTime } = this.generatorStore.preferences();
    return [
      cuisineLabel(cuisine),
      COOKING_TIME_OPTIONS.find((option) => option.value === cookingTime)?.label,
    ].filter((label) => label !== undefined);
  });
}
