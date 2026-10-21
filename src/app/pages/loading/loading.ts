import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RecipeStore } from '../../services/recipe-store';
import { LoadingScreen } from '../../shared/loading-screen/loading-screen';
import { Logo } from '../../shared/logo/logo';

/** Shows the loading screen until the recipes are ready, then opens the results. */
@Component({
  imports: [LoadingScreen, Logo, RouterLink],
  selector: 'app-loading',
  styleUrl: './loading.scss',
  templateUrl: './loading.html',
})
export class Loading {
  protected readonly recipeStore = inject(RecipeStore);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      if (this.recipeStore.status() === 'success') {
        this.router.navigate(['/results'], { replaceUrl: true });
      }
    });
  }
}
