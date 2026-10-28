export type Unit = 'g' | 'kg' | 'ml' | 'l' | 'tbsp' | 'tsp' | 'pcs';

export interface Ingredient {
  name: string;
  amount: number;
  unit: Unit;
}
