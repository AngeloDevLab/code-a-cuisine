import { Service } from '@angular/core';
import { MOCK_RECIPES } from '../data/mock-recipes';
import { MOCK_TOP_RECIPES } from '../data/mock-top-recipes';
import { RecipePreview, RecipeResponse } from '../models/recipe';
import { RecipeRequest } from '../models/recipe-request';

const MOCK_DELAY_MS = 3000;
const TOP_RECIPE_LIMIT = 5;

/** Talks to the recipe backend; returns mock data until the n8n webhook exists. */
@Service()
export class RecipeService {
  /** Generates three recipes for the given request. */
  async generate(request: RecipeRequest): Promise<RecipeResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    const recipes = MOCK_RECIPES.map((recipe) => ({ ...recipe, portions: request.portions }));
    return { recipes, quota: { remaining: 0, resetsAt: new Date().toISOString() } };
  }

  /** Returns the most liked recipes of the cookbook, best first. */
  async getMostLiked(): Promise<RecipePreview[]> {
    return [...MOCK_TOP_RECIPES].sort((a, b) => b.likes - a.likes).slice(0, TOP_RECIPE_LIMIT);
  }
}
