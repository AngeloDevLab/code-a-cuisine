import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RecipeStore } from '../../services/recipe-store';
import { Button } from '../../shared/button/button';
import { LoadingScreen } from '../../shared/loading-screen/loading-screen';
import { Logo } from '../../shared/logo/logo';

/** Shows the loading screen until the recipes are ready, then opens the results. */
@Component({
  imports: [Button, LoadingScreen, Logo, RouterLink],
  selector: 'app-loading',
  styleUrl: './loading.scss',
  templateUrl: './loading.html',
})
export class Loading {
  protected readonly recipeStore = inject(RecipeStore);
  private readonly router = inject(Router);

  /** Opens the results as soon as the generation has succeeded. */
  constructor() {
    effect(() => {
      if (this.recipeStore.status() === 'success') {
        this.router.navigate(['/results'], { replaceUrl: true });
      }
    });
  }
}
