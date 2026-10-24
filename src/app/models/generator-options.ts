import { CookingTime, Cuisine, Diet, Unit } from './recipe-request';

export interface Option<T> {
  value: T;
  label: string;
}

export interface UnitOption extends Option<Unit> {
  short: string;
}

export interface CookingTimeOption extends Option<CookingTime> {
  hint: string;
}

export const UNIT_OPTIONS: UnitOption[] = [
  { value: 'g', label: 'gram', short: 'g' },
  { value: 'ml', label: 'ml', short: 'ml' },
  { value: 'pcs', label: 'piece', short: '' },
];

export const COOKING_TIME_OPTIONS: CookingTimeOption[] = [
  { value: 'quick', label: 'Quick', hint: 'up to 20 min' },
  { value: 'medium', label: 'Medium', hint: '20-45 min' },
  { value: 'complex', label: 'Complex', hint: 'over 45 min' },
];

export const CUISINE_OPTIONS: Option<Cuisine>[] = [
  { value: 'german', label: 'German' },
  { value: 'italian', label: 'Italian' },
  { value: 'indian', label: 'Indian' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'gourmet', label: 'Gourmet' },
  { value: 'fusion', label: 'Fusion' },
];

/** Returns the display label of a cuisine, or the raw value if it is unknown. */
export function cuisineLabel(value: string | null): string {
  return CUISINE_OPTIONS.find((option) => option.value === value)?.label ?? value ?? '';
}

export const DIET_OPTIONS: Option<Diet>[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'none', label: 'No preferences' },
];

/** Returns the diet and cooking time labels shown as recipe tags, without a diet of 'none'. */
export function recipeTags(recipe: { diet: Diet; cookingTime: CookingTime }): string[] {
  const diet = recipe.diet === 'none' ? undefined : DIET_OPTIONS.find((option) => option.value === recipe.diet);
  const time = COOKING_TIME_OPTIONS.find((option) => option.value === recipe.cookingTime);
  return [diet?.label, time?.label].filter((label) => label !== undefined);
}
