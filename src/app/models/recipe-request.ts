export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'tbsp' | 'tsp' | 'pcs';
export type CookingTime = 'quick' | 'medium' | 'complex';
export type Cuisine = 'german' | 'italian' | 'japanese' | 'indian' | 'gourmet' | 'fusion';
export type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit;
}

export interface Preferences {
  portions: number;
  cooks: number;
  cookingTime: CookingTime;
  cuisine: Cuisine;
  diet: Diet;
}

export interface RecipeRequest extends Preferences {
  ingredients: Ingredient[];
}

export const INGREDIENT_LIMITS = { min: 1, max: 20, nameMaxLength: 50 } as const;
export const PORTION_LIMITS = { min: 1, max: 12 } as const;
export const COOK_LIMITS = { min: 1, max: 4 } as const;
