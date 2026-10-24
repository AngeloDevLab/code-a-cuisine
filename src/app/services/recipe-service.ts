import { Service } from '@angular/core';
import { N8N_WEBHOOK_URL } from '../config';
import { ApiError, RecipeResponse } from '../models/recipe';
import { RecipeRequest } from '../models/recipe-request';
import { getClientId } from './client-id';

/** Generates recipes through the n8n webhook. */
@Service()
export class RecipeService {
  /** Generates three recipes for the given request; throws an ApiError if n8n rejects it. */
  async generate(request: RecipeRequest): Promise<RecipeResponse> {
    const response = await fetch(`${N8N_WEBHOOK_URL}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...request, clientId: getClientId() }),
    });
    const body: unknown = await response.json().catch(() => null);
    if (!response.ok) throw toApiError(body);
    return body as RecipeResponse;
  }
}

/** Unwraps the `{ error }` body of a failed request, with a generic error if the body has none. */
function toApiError(body: unknown): ApiError {
  const error = typeof body === 'object' && body !== null && 'error' in body ? body.error : null;
  if (typeof error === 'object' && error !== null && 'code' in error && 'message' in error) {
    return error as ApiError;
  }
  return { code: 'internal_error', message: 'Something went wrong. Please try again.' };
}
