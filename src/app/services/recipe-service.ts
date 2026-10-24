import { Service } from '@angular/core';
import { N8N_WEBHOOK_URL } from '../config';
import { MOCK_LIBRARY } from '../data/mock-library';
import { ApiError, RecipePage, RecipePreview, RecipeResponse } from '../models/recipe';
import { Cuisine, RecipeRequest } from '../models/recipe-request';

const TOP_RECIPE_LIMIT = 5;
export const RECIPES_PER_PAGE = 20;

/** Talks to the recipe backend: generation via the n8n webhook, cookbook reads still mocked. */
@Service()
export class RecipeService {
  /** Generates three recipes for the given request; throws an ApiError if n8n rejects it. */
  async generate(request: RecipeRequest): Promise<RecipeResponse> {
    const response = await fetch(`${N8N_WEBHOOK_URL}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) throw toApiError(body);
    return body as RecipeResponse;
  }

  /** Returns the most liked recipes of the cookbook, best first. */
  async getMostLiked(): Promise<RecipePreview[]> {
    return [...MOCK_LIBRARY].sort((a, b) => b.likes - a.likes).slice(0, TOP_RECIPE_LIMIT);
  }

  /** Returns one page of the cookbook recipes of a cuisine; out of range pages are clamped. */
  async getByCuisine(cuisine: Cuisine, page: number): Promise<RecipePage> {
    const recipes = MOCK_LIBRARY.filter((recipe) => recipe.cuisine === cuisine);
    const pageCount = Math.max(Math.ceil(recipes.length / RECIPES_PER_PAGE), 1);
    const current = Math.min(Math.max(page, 1), pageCount);
    const start = (current - 1) * RECIPES_PER_PAGE;
    return { recipes: recipes.slice(start, start + RECIPES_PER_PAGE), total: recipes.length, page: current, pageCount };
  }
}

/** Unwraps the `{ error }` body of a failed request, with a generic error if the body has none. */
function toApiError(body: unknown): ApiError {
  const error = typeof body === 'object' && body !== null && 'error' in body ? body.error : null;
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    return error as ApiError;
  }
  return { code: 'internal_error', message: 'Something went wrong. Please try again.' };
}
