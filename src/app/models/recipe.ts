import { CookingTime, Cuisine, Diet, Ingredient } from './recipe-request';

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

export type RecipePreview = Pick<
  Recipe,
  'id' | 'title' | 'cookingTimeMinutes' | 'cookingTime' | 'cuisine' | 'diet' | 'likes'
>;

export interface RecipePage {
  recipes: RecipePreview[];
  total: number;
  page: number;
  pageCount: number;
}

export interface Quota {
  remaining: number;
  resetsAt: string;
}

export interface RecipeResponse {
  recipes: Recipe[];
  quota: Quota;
}

export type ApiErrorCode =
  | 'invalid_input'
  | 'insufficient_ingredients'
  | 'quota_exceeded'
  | 'system_quota_exceeded'
  | 'rate_limited'
  | 'ai_error'
  | 'internal_error';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  resetsAt?: string;
  retryAfterSeconds?: number;
}
