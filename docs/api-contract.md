# API Contract

Data exchanged between the Angular frontend, n8n and Supabase.

## Overview

| Action | Who talks to whom |
|---|---|
| Get recipe suggestions | Angular -> n8n webhook (n8n reads/writes Supabase, calls Gemini) |
| Show remaining quota | Angular -> n8n webhook |
| Browse cookbook, open recipe | Angular -> Supabase (read only) |
| Like a recipe | Angular -> Supabase function `like_recipe` |

The client IP is read by n8n from the request headers. The frontend never sends it, and it is never passed to Gemini. n8n validates it as IPv4 or IPv6. Users behind a shared IP (e.g. an office network) share one quota.

## GET `/webhook/quota`

Called when the generator opens, so the user sees the remaining recipes before generating.

### Response `200`

```json
{
  "remaining": 3,
  "limit": 3,
  "systemRemaining": 9,
  "resetsAt": "2026-10-19T00:00:00Z"
}
```

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
  "diet": "vegetarian"
}
```

| Field | Type | Rules |
|---|---|---|
| `ingredients` | array | 1 to 20 items |
| `ingredients[].name` | string | 1 to 50 characters, trimmed |
| `ingredients[].amount` | number | > 0 |
| `ingredients[].unit` | enum | `g`, `ml`, `pcs` |
| `portions` | integer | 1 to 12, default 2 |
| `cooks` | integer | 1 to 4, default 1 (the user plus up to 3 helpers) |
| `cookingTime` | enum | `quick` (up to 20 min), `medium` (20 to 45 min), `complex` (45+ min) |
| `cuisine` | enum | `german`, `italian`, `japanese`, `indian`, `gourmet`, `fusion` |
| `diet` | enum | `vegetarian`, `vegan`, `keto`, `none` |

The frontend validates these rules, n8n validates them again.

### Flow in n8n

1. Validate the request.
2. Check rate limiting and quota (per IP and system wide).
3. Generate 3 recipes with Gemini.
4. Save them to Supabase.
5. Return the 3 recipes.

### Response `200`

```json
{
  "recipes": [Recipe, Recipe, Recipe],
  "quota": { "remaining": 0, "resetsAt": "2026-10-19T00:00:00Z" }
}
```

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

All ingredients, including extra ones, only use `g`, `ml` or `pcs`.

### Errors

All errors share one shape:

```json
{
  "error": {
    "code": "quota_exceeded",
    "message": "You have used all 3 recipes for today.",
    "resetsAt": "2026-10-19T00:00:00Z"
  }
}
```

| Status | `code` | When |
|---|---|---|
| 400 | `invalid_input` | request breaks the rules above |
| 422 | `insufficient_ingredients` | Gemini judges the ingredients too few for the portions |
| 429 | `quota_exceeded` | IP quota (3 per day) used up |
| 429 | `system_quota_exceeded` | system quota (12 per day) used up |
| 429 | `rate_limited` | too many requests in a short time (throttling) |
| 502 | `ai_error` | Gemini failed or returned invalid JSON |
| 500 | `internal_error` | anything else |

`resetsAt` is only set for the quota errors. `rate_limited` sets `retryAfterSeconds` instead.

## Rules

### Quota and throttling

- The quota counts recipes. Every request generates 3 new recipes, all of them count.
- Per IP: 3 recipes per day, so 1 request per day.
- System wide: 12 recipes per day, so 4 requests per day.
- Quota values in all responses are recipe counts.
- Throttling: 1 request per 10 seconds per IP.
