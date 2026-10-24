import { RecipePreview } from '../models/recipe';
import { Cuisine } from '../models/recipe-request';

type Template = Omit<RecipePreview, 'id' | 'cuisine'>;

const TEMPLATES: Template[] = [
  { title: 'Pasta with spinach and cherry tomatoes', cookingTimeMinutes: 20, cookingTime: 'quick', diet: 'vegetarian', likes: 66 },
  { title: 'Creamy garlic shrimp pasta', cookingTimeMinutes: 22, cookingTime: 'medium', diet: 'none', likes: 32 },
  { title: 'Funghi salami pizza', cookingTimeMinutes: 16, cookingTime: 'quick', diet: 'none', likes: 42 },
  { title: 'Low Carb Vegan No-Bake Paleo Bars', cookingTimeMinutes: 35, cookingTime: 'medium', diet: 'vegan', likes: 57 },
];

// Fusion stays empty to show the empty state.
const RECIPE_COUNTS: Record<Cuisine, number> = {
  italian: 150,
  german: 25,
  japanese: 12,
  gourmet: 3,
  indian: 41,
  fusion: 0,
};

/** Placeholder for the public cookbook until Supabase is connected, newest first. */
export const MOCK_LIBRARY: RecipePreview[] = (Object.keys(RECIPE_COUNTS) as Cuisine[]).flatMap((cuisine) =>
  Array.from({ length: RECIPE_COUNTS[cuisine] }, (_, index) => createRecipe(cuisine, index)),
);

/** Builds one mock recipe from the templates with a varying like count. */
function createRecipe(cuisine: Cuisine, index: number): RecipePreview {
  const template = TEMPLATES[index % TEMPLATES.length];
  return { ...template, id: `${cuisine}-${index + 1}`, cuisine, likes: (template.likes + index * 17) % 100 };
}
