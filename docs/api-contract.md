# API Contract

Data exchanged between the Angular frontend, n8n and Supabase.

## Overview

| Action | Who talks to whom |
|---|---|
| Get recipe suggestions | Angular -> n8n webhook (n8n reads/writes Supabase, calls Gemini) |
| Browse cookbook, open recipe | Angular -> Supabase (read only, see [Cookbook reads](#cookbook-reads)) |
| Like a recipe | Angular -> Supabase function `like_recipe` |

The client IP is read by n8n from the request headers. The frontend never sends it, and it is never passed to Gemini. n8n validates it as IPv4 or IPv6. Users behind a shared IP (e.g. an office network) share one quota.

The frontend also sends a random browser id (`clientId`, a UUID kept in `localStorage`). n8n counts a request for the user if either the IP or the browser id matches, see [Quota and throttling](#quota-and-throttling).

## POST `/webhook/recipes`

### Request

```json
{
  "ingredients": [
    { "name": "tomato", "amount": 400, "unit": "g" },
    { "name": "spaghetti", "amount": 250, "unit": "g" }
  ],
  "portions": 2,
  "cooks": 1,
  "cookingTime": "quick",
  "cuisine": "italian",
  "diet": "vegetarian",
  "clientId": "61ae3d19-3d27-43af-8f95-d8d205dbf779"
}
```

| Field | Type | Rules |
|---|---|---|
| `ingredients` | array | 1 to 20 items |
| `ingredients[].name` | string | 1 to 50 characters, trimmed |
| `ingredients[].amount` | number | > 0 and at most 10000 (the frontend sets larger values back to 10000 while typing) |
| `ingredients[].unit` | enum | `g`, `kg`, `ml`, `l`, `tbsp`, `tsp`, `pcs` |
| `portions` | integer | 1 to 12, default 2 |
| `cooks` | integer | 1 to 4, default 1 (the user plus up to 3 helpers) |
| `cookingTime` | enum | `quick` (up to 20 min), `medium` (20 to 45 min), `complex` (45+ min) |
| `cuisine` | enum | `german`, `italian`, `japanese`, `indian`, `gourmet`, `fusion` |
| `diet` | enum | `vegetarian`, `vegan`, `keto`, `none` |
| `clientId` | string | optional UUID. A missing or invalid id is ignored, then only the IP counts |

The frontend validates these rules, n8n validates them again in case the webhook is called directly.

### Flow in n8n

1. Validate the request. Invalid requests are answered with `invalid_input` and never reach Gemini.
2. Check quota (per user and system wide) and throttling in `quota_log`. If a limit is reached, answer with the matching error without calling Gemini.
3. Reserve the request: insert a row into `quota_log` right away, so parallel requests already see it.
4. Ask Gemini for 3 recipes. In the same call Gemini judges whether the ingredients are enough for the portions.
5. If Gemini fails (`ai_error`), delete the reserved row again, so the request does not count.
6. On a rejection, answer with `insufficient_ingredients`. The reserved row stays and counts.
7. Save the 3 recipes to Supabase and return them.

Gemini answers with structured JSON, either 3 recipes or:

```json
{ "insufficient": true, "reason": "One egg is not enough for 12 portions." }
```

### Response `200`

```json
{
  "recipes": [Recipe, Recipe, Recipe],
  "quota": { "remaining": 2, "resetsAt": "2026-10-19T00:00:00Z" }
}
```

`quota.remaining` is the number of requests the user has left today.

### Recipe

```json
{
  "id": "6f1c2b9e-...",
  "title": "Spaghetti al Pomodoro",
  "cookingTimeMinutes": 20,
  "cookingTime": "quick",
  "cuisine": "italian",
  "diet": "vegetarian",
  "portions": 2,
  "cooks": 2,
  "likes": 0,
  "nutrition": {
    "perPortion": { "energyKcal": 540, "proteinG": 18, "fatG": 12, "carbsG": 88 }
  },
  "ingredients": {
    "yours": [{ "name": "tomato", "amount": 400, "unit": "g" }],
    "extra": [{ "name": "olive oil", "amount": 30, "unit": "ml" }]
  },
  "steps": [
    { "order": 1, "cook": 1, "title": "Boil the water", "text": "Bring a large pot of salted water to a boil.", "parallel": false },
    { "order": 2, "cook": 2, "title": "Prepare the tomatoes", "text": "Dice the tomatoes.", "parallel": true }
  ]
}
```

| Field | Notes |
|---|---|
| `ingredients.extra` | max. 3 basic ingredients the user does not have |
| `steps[].cook` | 1 to `cooks`, used for the per cook to do lists |
| `steps[].title` | short heading for the step, max. 4 words |
| `steps[].parallel` | `true` if the step runs at the same time as the previous one |
| `nutrition` | per portion only; totals and macro percentages are computed in the frontend |

All ingredients, including extra ones, use the same units as the request: `g`, `kg`, `ml`, `l`, `tbsp`, `tsp` or `pcs`. Recipes saved before the larger unit list only use `g`, `ml` or `pcs`.

### Errors

All errors share one shape. The frontend unwraps `error` and shows it in the popup.

```json
{
  "error": {
    "code": "quota_exceeded",
    "message": "You have used all 3 requests for today.",
    "resetsAt": "2026-10-19T00:00:00Z"
  }
}
```

| Status | `code` | When | Counts as request |
|---|---|---|---|
| 400 | `invalid_input` | request breaks the rules above | no |
| 422 | `insufficient_ingredients` | Gemini judges the ingredients far too few for the portions, not food, or only basics like water, salt or oil | yes |
| 429 | `quota_exceeded` | user quota (3 requests per day) used up | no |
| 429 | `system_quota_exceeded` | system quota (12 requests per day) used up | no |
| 429 | `rate_limited` | less than 10 seconds since the last request of this user | no |
| 502 | `ai_error` | Gemini failed or returned invalid JSON | no |
| 500 | `internal_error` | anything else | no |

`resetsAt` is only set for the quota errors. `rate_limited` sets `retryAfterSeconds` instead.

## Cookbook reads

The frontend reads the `recipes` table directly with supabase-js and the public `anon` key. Column names are snake_case in the database and renamed to the camelCase fields above with aliases in `select`, so no mapping is needed in the frontend.

### RecipePreview

Lists and the most liked recipes only load what a card shows:

```json
{
  "id": "6f1c2b9e-...",
  "title": "Spaghetti al Pomodoro",
  "cookingTimeMinutes": 20,
  "cookingTime": "quick",
  "cuisine": "italian",
  "diet": "vegetarian",
  "likes": 12
}
```

```ts
const PREVIEW = 'id, title, cookingTimeMinutes:cooking_time_minutes, cookingTime:cooking_time, cuisine, diet, likes';
```

### Queries

| Page | Query | Returns |
|---|---|---|
| Cookbook, most liked | `select(PREVIEW).order('likes', { ascending: false }).order('created_at', { ascending: false }).limit(5)` | 5 `RecipePreview` |
| Recipe list per cuisine | `select(PREVIEW, { count: 'exact' }).eq('cuisine', cuisine).order('created_at', { ascending: false }).range(from, to)` | 20 `RecipePreview` per page plus the total count |
| Recipe detail | `select(<all fields with aliases>).eq('id', id).maybeSingle()` | one `Recipe` or `null` |

- Pages hold 20 recipes, page 1 is `range(0, 19)`. `pageCount` is `ceil(count / 20)`, at least 1.
- Supabase answers `416` for a range behind the last recipe. The frontend then loads the last valid page.
- The detail page shows "Recipe not found" for `null`.

### Likes

```ts
supabase.rpc('like_recipe', { recipe_id: id, liked: true });
```

Returns the new like count. The frontend shows that count instead of only adding or removing one locally.

## Rules

### Quota and throttling

- The quota counts requests that reach Gemini. Every request generates 3 recipes or is rejected by Gemini, both count.
- Requests stopped before Gemini (invalid input, quota, throttling) and Gemini failures (`ai_error`) do not count.
- Per user: 3 requests per day, so up to 9 recipes. A request belongs to the user if its IP or its browser id matches. A device with both IPv4 and IPv6 can reach n8n under either address, the browser id links both addresses to one user. Clearing `localStorage` gives a new browser id, but the IP still counts, the system wide limit keeps the costs capped anyway.
- System wide: 12 requests per day, so up to 36 recipes. This caps the Gemini costs (paid tier, about 1 cent per request), a spending limit in Google AI Studio is the second safeguard.
- Days are counted in UTC, the quota resets at 00:00 UTC.
- Throttling: 1 request per 10 seconds per user.
- When the quota is used up, the user gets a message in the popup. There is no separate quota display.
