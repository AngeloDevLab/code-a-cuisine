import { Ingredient } from './ingredient';
import { Preferences } from './preferences';

export interface RecipeRequest extends Preferences {
  ingredients: Ingredient[];
}
