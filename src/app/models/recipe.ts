import { Ingredient } from './ingredient';
import { CookingTime, Cuisine, Diet } from './preferences';

export type RecipePreview = Pick<
  Recipe,
  'id' | 'title' | 'cookingTimeMinutes' | 'cookingTime' | 'cuisine' | 'diet' | 'likes'
>;

export interface Nutrition {
  energyKcal: number;
  proteinG: number;
  fatG: number;
  carbsG: number;
}

export interface RecipeStep {
  order: number;
  cook: number;
  title: string;
  text: string;
  parallel: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  cookingTimeMinutes: number;
  cookingTime: CookingTime;
  cuisine: Cuisine;
  diet: Diet;
  portions: number;
  cooks: number;
  likes: number;
  nutrition: { perPortion: Nutrition };
  ingredients: { yours: Ingredient[]; extra: Ingredient[] };
  steps: RecipeStep[];
}

export interface RecipePage {
  recipes: RecipePreview[];
  total: number;
  page: number;
  pageCount: number;
}
