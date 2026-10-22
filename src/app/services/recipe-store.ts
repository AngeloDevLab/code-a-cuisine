import { Service, inject, signal } from '@angular/core';
import { ApiError, Quota, Recipe } from '../models/recipe';
import { RecipeRequest } from '../models/recipe-request';
import { RecipeService } from './recipe-service';

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

/** Holds the generated recipes and the state of the current generation. */
@Service()
export class RecipeStore {
  private readonly api = inject(RecipeService);

  readonly recipes = signal<Recipe[]>([]);
  readonly quota = signal<Quota | null>(null);
  readonly status = signal<GenerationStatus>('idle');
  readonly error = signal<ApiError | null>(null);

  /** Requests new recipes and tracks loading, result and error. */
  async generate(request: RecipeRequest): Promise<void> {
    this.status.set('loading');
    this.error.set(null);
    try {
      const response = await this.api.generate(request);
      this.recipes.set(response.recipes);
      this.quota.set(response.quota);
      this.status.set('success');
    } catch (error) {
      this.error.set(toApiError(error));
      this.status.set('error');
    }
  }

  /** Changes the like count of the recipe with the given id. */
  changeLikes(id: string, delta: number): void {
    this.recipes.update((list) =>
      list.map((recipe) => (recipe.id === id ? { ...recipe, likes: Math.max(recipe.likes + delta, 0) } : recipe)),
    );
  }
}

/** Turns anything thrown during a request into an ApiError. */
function toApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    return error as ApiError;
  }
  return { code: 'internal_error', message: 'Something went wrong. Please try again.' };
}
