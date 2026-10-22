import { Component, input, signal } from '@angular/core';
import { Recipe } from '../../../models/recipe';
import { ChefBadge } from '../chef-badge/chef-badge';
import { SectionBanner } from '../section-banner/section-banner';
import { SectionToggle } from '../section-toggle/section-toggle';

/** Numbered cooking steps, each assigned to a cook. */
@Component({
  imports: [ChefBadge, SectionBanner, SectionToggle],
  selector: 'app-recipe-steps',
  styleUrl: './recipe-steps.scss',
  templateUrl: './recipe-steps.html',
})
export class RecipeSteps {
  readonly recipe = input.required<Recipe>();

  protected readonly expanded = signal(true);
}
