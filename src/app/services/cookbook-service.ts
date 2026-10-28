import { Service } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '../config';
import { Recipe, RecipePage, RecipePreview } from '../models/recipe';
import { Cuisine } from '../models/preferences';

const RANGE_NOT_SATISFIABLE = 'PGRST103';

const PREVIEW_COLUMNS = 'id, title, cookingTimeMinutes:cooking_time_minutes, cookingTime:cooking_time, cuisine, diet, likes';
const RECIPE_COLUMNS = `${PREVIEW_COLUMNS}, portions, cooks, nutrition, ingredients, steps`;

/** Reads the public cookbook from Supabase and sends likes; column aliases deliver the camelCase fields of the models. */
@Service()
export class CookbookService {
  private readonly client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  readonly recipesPerPage = 20;
  readonly topRecipeLimit = 5;

  /**
   * Returns the most liked recipes, best first.
   * @returns The top recipes as previews.
   */
  async getMostLiked(): Promise<RecipePreview[]> {
    const { data, error } = await this.client
      .from('recipes')
      .select(PREVIEW_COLUMNS)
      .order('likes', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(this.topRecipeLimit);
    if (error) throw error;
    return data as unknown as RecipePreview[];
  }

  /**
   * Returns one page of a cuisine, newest first; a page behind the last one falls back to the last one.
   * @param cuisine - The cuisine to list.
   * @param page - The requested page, starting at 1.
   * @returns The recipes of the page with the total and page count.
   */
  async getByCuisine(cuisine: Cuisine, page: number): Promise<RecipePage> {
    const result = await this.fetchPage(cuisine, Math.max(page, 1));
    if (result) return result;
    const lastPage = this.pageCountOf(await this.countByCuisine(cuisine));
    return (await this.fetchPage(cuisine, lastPage)) ?? { recipes: [], total: 0, page: 1, pageCount: 1 };
  }

  /**
   * Returns the full recipe with the given id, or null if there is none.
   * @param id - The id of the recipe.
   * @returns The recipe, or null if it does not exist.
   */
  async getById(id: string): Promise<Recipe | null> {
    const { data, error } = await this.client.from('recipes').select(RECIPE_COLUMNS).eq('id', id).maybeSingle();
    if (error) return null;
    return data as unknown as Recipe | null;
  }

  /**
   * Adds or removes one like and returns the new like count.
   * @param id - The id of the recipe.
   * @param liked - True to add a like, false to remove it.
   * @returns The new like count of the recipe.
   */
  async likeRecipe(id: string, liked: boolean): Promise<number> {
    const { data, error } = await this.client.rpc('like_recipe', { recipe_id: id, liked });
    if (error) throw error;
    return data as number;
  }

  /**
   * Loads one page with the total count, or null if the page lies behind the last recipe.
   * @param cuisine - The cuisine to list.
   * @param page - The page to load, starting at 1.
   * @returns The page, or null if it is out of range.
   */
  private async fetchPage(cuisine: Cuisine, page: number): Promise<RecipePage | null> {
    const from = (page - 1) * this.recipesPerPage;
    const { data, count, error } = await this.client
      .from('recipes')
      .select(PREVIEW_COLUMNS, { count: 'exact' })
      .eq('cuisine', cuisine)
      .order('created_at', { ascending: false })
      .range(from, from + this.recipesPerPage - 1);
    if (error?.code === RANGE_NOT_SATISFIABLE) return null;
    if (error) throw error;
    const total = count ?? 0;
    return { recipes: data as unknown as RecipePreview[], total, page, pageCount: this.pageCountOf(total) };
  }

  /**
   * Counts the recipes of a cuisine without loading them.
   * @param cuisine - The cuisine to count.
   * @returns The number of recipes.
   */
  private async countByCuisine(cuisine: Cuisine): Promise<number> {
    const { count, error } = await this.client
      .from('recipes')
      .select('id', { count: 'exact', head: true })
      .eq('cuisine', cuisine);
    if (error) throw error;
    return count ?? 0;
  }

  /**
   * Returns the number of pages for the given number of recipes, at least 1.
   * @param total - The number of recipes.
   * @returns The number of pages.
   */
  private pageCountOf(total: number): number {
    return Math.max(Math.ceil(total / this.recipesPerPage), 1);
  }
}
