import { Service } from '@angular/core';

const STORAGE_KEY = 'client-id';

/** Provides the random id of this browser that the backend counts requests by, next to the IP. */
@Service()
export class ClientId {
  private sessionId: string | null = null;

  /**
   * Returns the stored id or creates one; falls back to an id for this session if storage is blocked.
   * @returns The client id of this browser.
   */
  get(): string {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return stored;
      const id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
      return id;
    } catch {
      this.sessionId ??= crypto.randomUUID();
      return this.sessionId;
    }
  }
}
