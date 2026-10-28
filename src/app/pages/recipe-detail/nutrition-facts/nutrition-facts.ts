import { Component, computed, input, signal } from '@angular/core';
import { Nutrition, Recipe } from '../../../models/recipe';
import { SectionToggle } from '../section-toggle/section-toggle';

type Scope = 'portion' | 'total';

interface Share {
  label: string;
  modifier: string;
  value: number;
  offset: number;
  percent: number;
}

/** Energy and macros per portion or in total, with an optional pie chart of the calorie shares. */
@Component({
  imports: [SectionToggle],
  selector: 'app-nutrition-facts',
  styleUrl: './nutrition-facts.scss',
  templateUrl: './nutrition-facts.html',
})
export class NutritionFacts {
  readonly recipe = input.required<Recipe>();

  protected readonly expanded = signal(false);
  protected readonly scope = signal<Scope>('portion');

  protected readonly facts = computed(() => {
    const { energyKcal, proteinG, fatG, carbsG } = this.recipe().nutrition.perPortion;
    const factor = this.scope() === 'total' ? this.recipe().portions : 1;
    return [
      { label: 'Energy', value: `${energyKcal * factor} kcal` },
      { label: 'Protein', value: `${proteinG * factor}g` },
      { label: 'Fat', value: `${fatG * factor}g` },
      { label: 'Carbs', value: `${carbsG * factor}g` },
    ];
  });

  protected readonly shares = computed(() => toShares(this.recipe().nutrition.perPortion));
}

/**
 * Splits the macro calories into pie slices with their start offset and rounded percentage.
 * @param nutrition - The nutrition values per portion.
 * @returns One slice each for protein, fat and carbs.
 */
function toShares(nutrition: Nutrition): Share[] {
  const macros = [
    { label: 'Protein', modifier: 'protein', kcal: nutrition.proteinG * 4 },
    { label: 'Fat', modifier: 'fat', kcal: nutrition.fatG * 9 },
    { label: 'Carbs', modifier: 'carbs', kcal: nutrition.carbsG * 4 },
  ];
  const total = macros.reduce((sum, macro) => sum + macro.kcal, 0) || 1;
  let offset = 0;
  return macros.map(({ label, modifier, kcal }) => {
    const value = (kcal / total) * 100;
    const share = { label, modifier, value, offset, percent: Math.round(value) };
    offset += value;
    return share;
  });
}
