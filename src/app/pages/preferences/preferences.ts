import { Component, inject } from '@angular/core';
import { FormField, form, max, min } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { COOK_LIMITS, PORTION_LIMITS } from '../../constants/limits';
import { COOKING_TIME_OPTIONS, CUISINE_OPTIONS, DIET_OPTIONS } from '../../constants/options';
import { GeneratorStore } from '../../services/generator-store';
import { RecipeStore } from '../../services/recipe-store';
import { BackLink } from '../../shared/back-link/back-link';
import { Button } from '../../shared/button/button';
import { LegalLinks } from '../../shared/legal-links/legal-links';
import { Logo } from '../../shared/logo/logo';
import { Stepper } from '../../shared/stepper/stepper';

/** Second generator step where the user picks portions, cooks, time, cuisine and diet. */
@Component({
  imports: [BackLink, Button, FormField, LegalLinks, Logo, Stepper],
  selector: 'app-preferences',
  styleUrl: './preferences.scss',
  templateUrl: './preferences.html',
})
export class Preferences {
  private readonly store = inject(GeneratorStore);
  private readonly recipeStore = inject(RecipeStore);
  private readonly router = inject(Router);

  protected readonly cookingTimes = COOKING_TIME_OPTIONS;
  protected readonly cuisines = CUISINE_OPTIONS;
  protected readonly diets = DIET_OPTIONS;

  protected readonly preferencesForm = form(this.store.preferences, (path) => {
    min(path.portions, PORTION_LIMITS.min);
    max(path.portions, PORTION_LIMITS.max);
    min(path.cooks, COOK_LIMITS.min);
    max(path.cooks, COOK_LIMITS.max);
  });

  /**
   * Starts the generation in the background and opens the loading page.
   * @param event - The submit event of the form.
   */
  protected generate(event: Event): void {
    event.preventDefault();
    if (this.preferencesForm().invalid()) return;
    void this.recipeStore.generate(this.store.request());
    this.router.navigate(['/generator/loading']);
  }
}
