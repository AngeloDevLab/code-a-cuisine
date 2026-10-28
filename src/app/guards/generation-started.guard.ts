import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { RecipeStore } from '../services/recipe-store';

/**
 * Sends the user back to the generator if no generation was started.
 * @returns True to allow the route, otherwise a redirect to the generator.
 */
export const generationStartedGuard: CanActivateFn = () =>
  inject(RecipeStore).status() !== 'idle' || inject(Router).createUrlTree(['/generator']);
