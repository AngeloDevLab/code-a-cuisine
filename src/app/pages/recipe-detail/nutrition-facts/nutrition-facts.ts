import { Component, computed, input } from '@angular/core';
import { Recipe } from '../../../models/recipe';

/** Energy and macros per portion. */
@Component({
  selector: 'app-nutrition-facts',
  styleUrl: './nutrition-facts.scss',
  templateUrl: './nutrition-facts.html',
})
export class NutritionFacts {
  readonly recipe = input.required<Recipe>();

  protected readonly facts = computed(() => {
    const { energyKcal, proteinG, fatG, carbsG } = this.recipe().nutrition.perPortion;
    return [
      { label: 'Energy', value: `${energyKcal} kcal` },
      { label: 'Protein', value: `${proteinG}g` },
      { label: 'Fat', value: `${fatG}g` },
      { label: 'Carbs', value: `${carbsG}g` },
    ];
  });
}
