import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GeneratorStore } from '../services/generator-store';

/** Sends the user back to the ingredients step if no ingredient was entered yet. */
export const hasIngredientsGuard: CanActivateFn = () =>
  inject(GeneratorStore).hasIngredients() || inject(Router).createUrlTree(['/generator']);
