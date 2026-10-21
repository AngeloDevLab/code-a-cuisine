import { Service } from '@angular/core';
import { MOCK_RECIPES } from '../data/mock-recipes';
import { RecipeResponse } from '../models/recipe';
import { RecipeRequest } from '../models/recipe-request';

const MOCK_DELAY_MS = 3000;

/** Talks to the recipe backend; returns mock data until the n8n webhook exists. */
@Service()
export class RecipeService {
  /** Generates three recipes for the given request. */
  async generate(request: RecipeRequest): Promise<RecipeResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const recipes = MOCK_RECIPES.map((recipe) => ({ ...recipe, portions: request.portions }));
    return { recipes, quota: { remaining: 0, resetsAt: new Date().toISOString() } };
  }
}
