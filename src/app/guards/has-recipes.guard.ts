import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RecipeStore } from '../services/recipe-store';

/**
 * Sends the user back to the generator if there are no generated recipes.
 * @returns True to allow the route, otherwise a redirect to the generator.
 */
export const hasRecipesGuard: CanActivateFn = () =>
  inject(RecipeStore).recipes().length > 0 || inject(Router).createUrlTree(['/generator']);
