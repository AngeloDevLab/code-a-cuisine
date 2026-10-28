import { CookingTimeOption, Option, UnitOption } from '../models/option';
import { Cuisine, Diet } from '../models/preferences';

export const UNIT_OPTIONS: UnitOption[] = [
  { value: 'g', label: 'gram', metric: true },
  { value: 'kg', label: 'kg', metric: true },
  { value: 'ml', label: 'ml', metric: true },
  { value: 'l', label: 'liter', metric: true },
  { value: 'tbsp', label: 'tbsp' },
  { value: 'tsp', label: 'tsp' },
  { value: 'pcs', label: 'piece', plural: 'pieces' },
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

export const DIET_OPTIONS: Option<Diet>[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'none', label: 'No preferences' },
];
