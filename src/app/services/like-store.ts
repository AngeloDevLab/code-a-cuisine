import { Service, inject, signal } from '@angular/core';
import { RecipeStore } from './recipe-store';

const STORAGE_KEY = 'liked-recipes';

/** Remembers which recipes this browser liked and keeps the like counts in sync. */
@Service()
export class LikeStore {
  private readonly recipeStore = inject(RecipeStore);

  readonly likedIds = signal<string[]>(readLikedIds());

  /** Returns whether the recipe with the given id is liked. */
  isLiked(id: string): boolean {
    return this.likedIds().includes(id);
  }

  /** Likes or unlikes the recipe with the given id. */
  toggle(id: string): void {
    const liked = !this.isLiked(id);
    this.likedIds.update((ids) => (liked ? [...ids, id] : ids.filter((likedId) => likedId !== id)));
    saveLikedIds(this.likedIds());
    this.recipeStore.changeLikes(id, liked ? 1 : -1);
  }
}

/** Reads the liked recipe ids from localStorage. */
function readLikedIds(): string[] {
  try {
    const ids: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/** Writes the liked recipe ids to localStorage. */
function saveLikedIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be blocked, the like then only lasts for this session.
  }
}
