import { Unit } from './ingredient';
import { CookingTime } from './preferences';

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
