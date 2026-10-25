import { Service } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '../config';
import { Recipe, RecipePage, RecipePreview } from '../models/recipe';
import { Cuisine } from '../models/recipe-request';

export const RECIPES_PER_PAGE = 20;
export const TOP_RECIPE_LIMIT = 5;
const RANGE_NOT_SATISFIABLE = 'PGRST103';

const PREVIEW_COLUMNS = 'id, title, cookingTimeMinutes:cooking_time_minutes, cookingTime:cooking_time, cuisine, diet, likes';
const RECIPE_COLUMNS = `${PREVIEW_COLUMNS}, portions, cooks, nutrition, ingredients, steps`;

/** Reads the public cookbook from Supabase and sends likes; column aliases deliver the camelCase fields of the models. */
@Service()
export class CookbookService {
  private readonly client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  /** Returns the most liked recipes, best first. */
  async getMostLiked(): Promise<RecipePreview[]> {
    const { data, error } = await this.client
      .from('recipes')
      .select(PREVIEW_COLUMNS)
      .order('likes', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(TOP_RECIPE_LIMIT);
    if (error) throw error;
    return data as unknown as RecipePreview[];
  }

  /** Returns one page of a cuisine, newest first; a page behind the last one falls back to the last one. */
  async getByCuisine(cuisine: Cuisine, page: number): Promise<RecipePage> {
    const result = await this.fetchPage(cuisine, Math.max(page, 1));
    if (result) return result;
    const lastPage = pageCountOf(await this.countByCuisine(cuisine));
    return (await this.fetchPage(cuisine, lastPage)) ?? { recipes: [], total: 0, page: 1, pageCount: 1 };
  }

  /** Returns the full recipe with the given id, or null if there is none. */
  async getById(id: string): Promise<Recipe | null> {
    const { data, error } = await this.client.from('recipes').select(RECIPE_COLUMNS).eq('id', id).maybeSingle();
    if (error) return null;
    return data as unknown as Recipe | null;
  }

  /** Adds or removes one like and returns the new like count. */
  async likeRecipe(id: string, liked: boolean): Promise<number> {
    const { data, error } = await this.client.rpc('like_recipe', { recipe_id: id, liked });
    if (error) throw error;
    return data as number;
  }

  /** Loads one page with the total count, or null if the page lies behind the last recipe. */
  private async fetchPage(cuisine: Cuisine, page: number): Promise<RecipePage | null> {
    const from = (page - 1) * RECIPES_PER_PAGE;
    const { data, count, error } = await this.client
      .from('recipes')
      .select(PREVIEW_COLUMNS, { count: 'exact' })
      .eq('cuisine', cuisine)
      .order('created_at', { ascending: false })
      .range(from, from + RECIPES_PER_PAGE - 1);
    if (error?.code === RANGE_NOT_SATISFIABLE) return null;
    if (error) throw error;
    const total = count ?? 0;
    return { recipes: data as unknown as RecipePreview[], total, page, pageCount: pageCountOf(total) };
  }

  /** Counts the recipes of a cuisine without loading them. */
  private async countByCuisine(cuisine: Cuisine): Promise<number> {
    const { count, error } = await this.client
      .from('recipes')
      .select('id', { count: 'exact', head: true })
      .eq('cuisine', cuisine);
    if (error) throw error;
    return count ?? 0;
  }
}

/** Returns the number of pages for the given number of recipes, at least 1. */
function pageCountOf(total: number): number {
  return Math.max(Math.ceil(total / RECIPES_PER_PAGE), 1);
}
