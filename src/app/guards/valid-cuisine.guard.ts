import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CUISINE_OPTIONS } from '../constants/options';

/**
 * Sends the user to the cookbook if the cuisine in the url does not exist.
 * @param route - The activated route with the cuisine param.
 * @returns True to allow the route, otherwise a redirect to the cookbook.
 */
export const validCuisineGuard: CanActivateFn = (route) =>
  CUISINE_OPTIONS.some((option) => option.value === route.paramMap.get('cuisine')) ||
  inject(Router).createUrlTree(['/cookbook']);
