# Database (Supabase)

Two tables. n8n writes with the `service_role` key (kept in n8n only), the frontend reads with the public `anon` key.

## `recipes`

One row per generated recipe. Mirrors the Recipe object in [api-contract.md](api-contract.md).

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | primary key, `gen_random_uuid()` |
| `created_at` | `timestamptz` | `now()` |
| `title` | `text` | not null |
| `cooking_time_minutes` | `int` | not null |
| `cooking_time` | `text` | `quick`, `medium`, `complex` |
| `cuisine` | `text` | `german`, `italian`, `japanese`, `indian`, `gourmet`, `fusion` |
| `diet` | `text` | `vegetarian`, `vegan`, `keto`, `none` |
| `portions` | `int` | 1 to 12 |
| `cooks` | `int` | 1 to 4 |
| `likes` | `int` | default 0 |
| `nutrition` | `jsonb` | `{ perPortion: { energyKcal, proteinG, fatG, carbsG } }` |
| `ingredients` | `jsonb` | `{ yours: [...], extra: [...] }` |
| `steps` | `jsonb` | `[{ order, cook, title, text, parallel }]` |

Index on `(cuisine, created_at desc)` for the paginated category lists and on `(likes desc, created_at desc)` for the most liked recipes.

## `quota_log`

One row per request that reached Gemini, whether it returned recipes or a rejection. Used by n8n for quota and throttling, see [api-contract.md](api-contract.md#quota-and-throttling).

| Column | Type | Notes |
|---|---|---|
| `id` | `bigint` | primary key, identity |
| `created_at` | `timestamptz` | `now()` |
| `ip` | `inet` | supports IPv4 and IPv6 |

Index on `(ip, created_at)`.

- Requests today per IP: `count(*) where ip = ? and created_at >= today 00:00 UTC`, limit 3.
- Requests today system wide: the same without the IP filter, limit 12.
- Throttling: latest `created_at` of the IP must be at least 10 seconds ago.

- Days are counted in UTC, the quota resets at 00:00 UTC.
- Rows older than 2 days are deleted (IP addresses are personal data).

## Access (RLS)

| Table | `anon` (frontend) |
|---|---|
| `recipes` | `select` only |
| `quota_log` | no access |

Likes go through a database function, so `anon` can never update other columns:

```sql
like_recipe(recipe_id uuid, liked boolean)
```

`liked = true` adds one like, `false` removes one (never below 0). It returns the new like count. The browser remembers liked recipes in `localStorage`.

## SQL

```sql
create table recipes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  cooking_time_minutes int not null,
  cooking_time text not null check (cooking_time in ('quick', 'medium', 'complex')),
  cuisine text not null check (cuisine in ('german', 'italian', 'japanese', 'indian', 'gourmet', 'fusion')),
  diet text not null check (diet in ('vegetarian', 'vegan', 'keto', 'none')),
  portions int not null check (portions between 1 and 12),
  cooks int not null check (cooks between 1 and 4),
  likes int not null default 0 check (likes >= 0),
  nutrition jsonb not null,
  ingredients jsonb not null,
  steps jsonb not null
);

create index recipes_cuisine_created_idx on recipes (cuisine, created_at desc);
create index recipes_likes_created_idx on recipes (likes desc, created_at desc);

create table quota_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  ip inet not null
);

create index quota_log_ip_created_idx on quota_log (ip, created_at);

-- "Automatically expose new tables" is disabled, so privileges are granted explicitly
grant select on recipes to anon;
grant select, insert, update, delete on recipes, quota_log to service_role;

alter table recipes enable row level security;
alter table quota_log enable row level security;

create policy "Recipes are public" on recipes
  for select to anon using (true);

create function like_recipe(recipe_id uuid, liked boolean)
returns int
language sql
security definer
set search_path = public
as $$
  update recipes
  set likes = greatest(likes + case when liked then 1 else -1 end, 0)
  where id = recipe_id
  returning likes;
$$;

revoke execute on function like_recipe(uuid, boolean) from public;
grant execute on function like_recipe(uuid, boolean) to anon;
```
