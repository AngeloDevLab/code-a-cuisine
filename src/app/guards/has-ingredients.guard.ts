import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GeneratorStore } from '../services/generator-store';

/**
 * Sends the user back to the ingredients step if no ingredient was entered yet.
 * @returns True to allow the route, otherwise a redirect to the generator.
 */
export const hasIngredientsGuard: CanActivateFn = () =>
  inject(GeneratorStore).hasIngredients() || inject(Router).createUrlTree(['/generator']);
