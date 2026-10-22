import { Component, computed, inject, input } from '@angular/core';
import { LikeStore } from '../../../services/like-store';

/** Heart button that lets the user like a finished recipe. */
@Component({
  selector: 'app-recipe-like',
  styleUrl: './recipe-like.scss',
  template: `
    <p class="like__text">
      <strong class="like__question">Just finished this meal?</strong>
      Give it a heart, so that the others know this is delicious.
    </p>
    <button class="like__button" type="button" aria-label="Like this recipe" [attr.aria-pressed]="liked()"
      (click)="likeStore.toggle(recipeId())">
      <span class="like__icon" [class.like__icon--filled]="liked()" aria-hidden="true"></span>
    </button>
  `,
})
export class RecipeLike {
  protected readonly likeStore = inject(LikeStore);

  readonly recipeId = input.required<string>();

  protected readonly liked = computed(() => this.likeStore.isLiked(this.recipeId()));
}
