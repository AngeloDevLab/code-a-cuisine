import INGREDIENTS from '../data/ingredients.json';

const MIN_QUERY_LENGTH = 2;
const MAX_SUGGESTIONS = 5;

/** Returns up to five known ingredients containing the query, prefix matches first. */
export function findSuggestions(query: string): string[] {
  const term = query.trim().toLowerCase();
  if (term.length < MIN_QUERY_LENGTH) return [];
  const startsLater = (name: string) => Number(!name.toLowerCase().startsWith(term));
  const matches = INGREDIENTS.filter((name) => name.toLowerCase().includes(term))
    .sort((a, b) => startsLater(a) - startsLater(b))
    .slice(0, MAX_SUGGESTIONS);
  return matches.length === 1 && matches[0].toLowerCase() === term ? [] : matches;
}
