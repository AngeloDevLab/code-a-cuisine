import { Recipe } from './recipe';

export type ApiErrorCode =
  | 'invalid_input'
  | 'insufficient_ingredients'
  | 'quota_exceeded'
  | 'system_quota_exceeded'
  | 'rate_limited'
  | 'ai_error'
  | 'internal_error';

export type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface Quota {
  remaining: number;
  resetsAt: string;
}

export interface RecipeResponse {
  recipes: Recipe[];
  quota: Quota;
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  resetsAt?: string;
  retryAfterSeconds?: number;
}
