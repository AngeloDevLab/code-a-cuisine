import { CookingTime, Cuisine, Diet, Unit } from './recipe-request';

export interface Option<T> {
  value: T;
  label: string;
}

// Metric units follow the amount directly ("80g"), the others as a word ("2 tbsp", "3 pieces").
export interface UnitOption extends Option<Unit> {
  metric?: true;
  plural?: string;
}

export interface CookingTimeOption extends Option<CookingTime> {
  hint: string;
}

export const UNIT_OPTIONS: UnitOption[] = [
  { value: 'g', label: 'gram', metric: true },
  { value: 'kg', label: 'kg', metric: true },
  { value: 'ml', label: 'ml', metric: true },
  { value: 'l', label: 'liter', metric: true },
  { value: 'tbsp', label: 'tbsp' },
  { value: 'tsp', label: 'tsp' },
  { value: 'pcs', label: 'piece', plural: 'pieces' },
];

/** Formats an amount with its unit, e.g. "80g", "1 tbsp" or "3 pieces". */
export function formatAmount(amount: number, unit: Unit): string {
  const option = UNIT_OPTIONS.find((candidate) => candidate.value === unit);
  if (!option || option.metric) return `${amount}${unit}`;
  return `${amount} ${amount === 1 ? option.label : (option.plural ?? option.label)}`;
}

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
