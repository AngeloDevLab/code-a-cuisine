import { Service } from '@angular/core';
import { MOCK_LIBRARY } from '../data/mock-library';
import { MOCK_RECIPES } from '../data/mock-recipes';
import { RecipePage, RecipePreview, RecipeResponse } from '../models/recipe';
import { Cuisine, RecipeRequest } from '../models/recipe-request';

const MOCK_DELAY_MS = 3000;
const TOP_RECIPE_LIMIT = 5;
export const RECIPES_PER_PAGE = 20;

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
