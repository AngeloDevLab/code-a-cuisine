import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CUISINE_OPTIONS } from '../models/generator-options';

/** Sends the user to the cookbook if the cuisine in the url does not exist. */
export const validCuisineGuard: CanActivateFn = (route) =>
  CUISINE_OPTIONS.some((option) => option.value === route.paramMap.get('cuisine')) ||
  inject(Router).createUrlTree(['/cookbook']);
