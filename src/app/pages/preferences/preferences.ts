import { Component, inject } from '@angular/core';
import { FormField, form, max, min } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { COOKING_TIME_OPTIONS, CUISINE_OPTIONS, DIET_OPTIONS } from '../../models/generator-options';
import { COOK_LIMITS, PORTION_LIMITS } from '../../models/recipe-request';
import { GeneratorStore } from '../../services/generator-store';
import { Logo } from '../../shared/logo/logo';
import { Stepper } from '../../shared/stepper/stepper';

/** Second generator step where the user picks portions, cooks, time, cuisine and diet. */
@Component({
  imports: [FormField, Logo, RouterLink, Stepper],
  selector: 'app-preferences',
  styleUrl: './preferences.scss',
  templateUrl: './preferences.html',
})
export class Preferences {
  private readonly store = inject(GeneratorStore);
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

  /** Starts the generation, for now it only opens the results page. */
  protected generate(event: Event): void {
    event.preventDefault();
    if (this.preferencesForm().invalid()) return;
    this.router.navigate(['/results']);
  }
}
