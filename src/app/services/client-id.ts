const STORAGE_KEY = 'client-id';

let sessionId: string | null = null;

/** Returns the random id of this browser that the backend counts requests by, next to the IP. */
export function getClientId(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    sessionId ??= crypto.randomUUID();
    return sessionId;
  }
}
