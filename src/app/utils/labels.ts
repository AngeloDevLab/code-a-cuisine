import { COOKING_TIME_OPTIONS, CUISINE_OPTIONS, DIET_OPTIONS, UNIT_OPTIONS } from '../constants/options';
import { Unit } from '../models/ingredient';
import { CookingTime, Diet } from '../models/preferences';

/** Formats an amount with its unit, e.g. "80g", "1 tbsp" or "3 pieces". */
export function formatAmount(amount: number, unit: Unit): string {
  const option = UNIT_OPTIONS.find((candidate) => candidate.value === unit);
  if (!option || option.metric) return `${amount}${unit}`;
  return `${amount} ${amount === 1 ? option.label : (option.plural ?? option.label)}`;
}

/** Returns the display label of a cuisine, or the raw value if it is unknown. */
export function cuisineLabel(value: string | null): string {
  return CUISINE_OPTIONS.find((option) => option.value === value)?.label ?? value ?? '';
}

/** Returns the diet and cooking time labels shown as recipe tags, without a diet of 'none'. */
export function recipeTags(recipe: { diet: Diet; cookingTime: CookingTime }): string[] {
  const diet = recipe.diet === 'none' ? undefined : DIET_OPTIONS.find((option) => option.value === recipe.diet);
  const time = COOKING_TIME_OPTIONS.find((option) => option.value === recipe.cookingTime);
  return [diet?.label, time?.label].filter((label) => label !== undefined);
}
