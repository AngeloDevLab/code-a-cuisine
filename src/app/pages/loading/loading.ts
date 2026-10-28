import { Component, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '../../models/api';
import { PopupMessage } from '../../models/popup';
import { PopupStore } from '../../services/popup-store';
import { RecipeStore } from '../../services/recipe-store';
import { LoadingScreen } from '../../shared/loading-screen/loading-screen';

const INSUFFICIENT_MESSAGE: PopupMessage = {
  title: ['Ups!', 'Not quite enough...'],
  text: "It looks like some ingredient quantities aren't sufficient for your selected servings. Please add or adjust quantities and try again.",
  action: { label: 'Go back to ingredients', link: '/generator' },
};

/** Shows the loading screen until the recipes are ready, then opens the results or reports the error. */
@Component({
  imports: [LoadingScreen],
  selector: 'app-loading',
  templateUrl: './loading.html',
})
export class Loading {
  private readonly recipeStore = inject(RecipeStore);
  private readonly popupStore = inject(PopupStore);
  private readonly router = inject(Router);

  /** Leaves the loading page as soon as the generation has succeeded or failed. */
  constructor() {
    effect(() => {
      const status = this.recipeStore.status();
      const error = this.recipeStore.error();
      if (status === 'success') {
        this.router.navigate(['/results'], { replaceUrl: true });
      } else if (status === 'error' && error) {
        this.popupStore.show(toPopupMessage(error));
        this.router.navigate(['/generator/preferences'], { replaceUrl: true });
      }
    });
  }
}

/** Turns an api error into the message shown in the popup. */
function toPopupMessage(error: ApiError): PopupMessage {
  if (error.code === 'insufficient_ingredients') {
    return INSUFFICIENT_MESSAGE;
  }
  return { title: ['Ups!', 'Something went wrong...'], text: error.message };
}
