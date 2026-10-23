import { RecipePreview } from '../models/recipe';

/** Placeholder for the most liked cookbook recipes until Supabase is connected. */
export const MOCK_TOP_RECIPES: RecipePreview[] = [
  { id: 'top-1', title: 'Pasta with spinach and cherry tomatoes', cookingTimeMinutes: 20, likes: 66 },
  { id: 'top-2', title: 'Low Carb Vegan No-Bake Paleo Bars', cookingTimeMinutes: 35, likes: 57 },
  { id: 'top-3', title: 'Schnitzel with potato salad', cookingTimeMinutes: 45, likes: 49 },
  { id: 'top-4', title: 'Chicken tikka masala', cookingTimeMinutes: 50, likes: 41 },
  { id: 'top-5', title: 'Salmon teriyaki bowl', cookingTimeMinutes: 25, likes: 38 },
];
