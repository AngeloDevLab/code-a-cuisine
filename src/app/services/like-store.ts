import { Service, inject, signal } from '@angular/core';
import { CookbookService } from './cookbook-service';

const STORAGE_KEY = 'liked-recipes';

/** Remembers which recipes this browser liked and the like counts Supabase returned. */
@Service()
export class LikeStore {
  private readonly cookbook = inject(CookbookService);
  private readonly pending = new Set<string>();

  readonly likedIds = signal<string[]>(readLikedIds());
  readonly counts = signal<Record<string, number>>({});

  /**
   * Returns whether the recipe with the given id is liked.
   * @param id - The id of the recipe.
   * @returns True if this browser liked the recipe.
   */
  isLiked(id: string): boolean {
    return this.likedIds().includes(id);
  }

  /**
   * Likes or unlikes the recipe and stores the new count; undoes the like if the request fails.
   * @param id - The id of the recipe.
   * @returns A promise that resolves once the request is done.
   */
  async toggle(id: string): Promise<void> {
    if (this.pending.has(id)) return;
    const liked = !this.isLiked(id);
    this.pending.add(id);
    this.setLiked(id, liked);
    try {
      const count = await this.cookbook.likeRecipe(id, liked);
      this.counts.update((counts) => ({ ...counts, [id]: count }));
    } catch {
      this.setLiked(id, !liked);
    } finally {
      this.pending.delete(id);
    }
  }

  /**
   * Marks the recipe as liked or not liked and saves the list.
   * @param id - The id of the recipe.
   * @param liked - Whether the recipe is liked now.
   */
  private setLiked(id: string, liked: boolean): void {
    this.likedIds.update((ids) => (liked ? [...ids, id] : ids.filter((likedId) => likedId !== id)));
    saveLikedIds(this.likedIds());
  }
}

/**
 * Reads the liked recipe ids from localStorage.
 * @returns The stored ids, empty if there are none or storage is blocked.
 */
function readLikedIds(): string[] {
  try {
    const ids: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(ids) ? ids.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

/**
 * Writes the liked recipe ids to localStorage.
 * @param ids - The ids of all liked recipes.
 */
function saveLikedIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be blocked, the like then only lasts for this session.
  }
}
