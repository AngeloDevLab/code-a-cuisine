export type CookingTime = 'quick' | 'medium' | 'complex';
export type Cuisine = 'german' | 'italian' | 'japanese' | 'indian' | 'gourmet' | 'fusion';
export type Diet = 'vegetarian' | 'vegan' | 'keto' | 'none';

export interface Preferences {
  portions: number;
  cooks: number;
  cookingTime: CookingTime;
  cuisine: Cuisine;
  diet: Diet;
}
