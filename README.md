# Code à Cuisine

An AI recipe generator built with Angular. Enter the ingredients you have at home, choose your preferences, and an n8n workflow asks Google Gemini for three recipes that use them. Every generated recipe ends up in a public cookbook that anyone can browse without an account.

Built as a solo project at Developer Akademie.

**Live:** [cuisine.angelodevelopment.de](https://cuisine.angelodevelopment.de)

## Features

- Ingredient input with autocomplete, amount and unit (gram, kg, ml, liter, tbsp, tsp, piece), up to 20 ingredients
- Preferences: portions (1 to 12), cooking time (quick, medium, complex), cuisine (German, Italian, Japanese, Indian, Gourmet, Fusion), diet (vegetarian, vegan, keto, none) and up to 3 helpers
- Exactly 3 different recipes per request, each using at least 70% of your ingredients plus at most 3 extra basics, which are marked as missing
- Step by step instructions in a workflow optimized order, with parallel steps marked
- Task split for several cooks: every step is assigned to a chef, so each person has their own list
- Nutrition per portion and for the whole recipe, macros in grams and percent with charts
- Public cookbook: the 5 most liked recipes, one list per cuisine with 20 recipes per page, full detail view
- Likes, one per recipe and browser
- Quota as a cost airbag: 3 requests per user per day, 12 system wide, 1 request per 10 seconds
- Clear error messages in a popup, for example when the quota is used up or the ingredients are not enough for the portions
- Responsive from 320px, accessibility checked with axe DevTools (0 issues on every page) and fully usable with the keyboard
- Imprint and privacy policy

## Demo

1. Open [cuisine.angelodevelopment.de](https://cuisine.angelodevelopment.de) and click **Get started**.
2. Add a few ingredients with amounts, for example *500 gram potatoes, 4 piece eggs, 200 ml cream, 1 piece onion, 2 tbsp butter*.
3. Choose your preferences, for example 2 portions, 2 cooks and German cuisine, then click **Generate recipe**.
4. After a short wait the 3 recipes appear. Open one to see the steps per chef and the nutrition charts.
5. Go to the **Cookbook**: your recipes are now in the German list, and you can like them.

Each user can generate 3 times per day. Enter something that is not food, for example *2 piece shoe*, to see how the AI rejects a request.

## Tech Stack

- Angular 22 (standalone components, signals, Signal Forms, zoneless), TypeScript, SCSS
- n8n (self-hosted with Docker) with an AI Agent on Google Gemini 3.6 Flash and a Structured Output Parser
- Supabase (Postgres) for recipes, likes and the quota log, read from the browser with `supabase-js`
- Caddy on a Hetzner server for HTTPS, hosting and rate limiting, deployed with a GitHub Action

## Getting Started

1. Clone the repository and install the dependencies:
   ```bash
   git clone https://github.com/AngeloDevLab/code-a-cuisine.git
   cd code-a-cuisine
   npm ci
   ```
2. Start the dev server:
   ```bash
   npm start
   ```
3. The app opens at `http://localhost:4200`. It already uses the live n8n webhook and Supabase project from [src/app/config.ts](src/app/config.ts), and `localhost:4200` is an allowed origin of the webhook.

To run your own backend, create the tables from [docs/database.md](docs/database.md), import the workflows as described in [n8n/README.md](n8n/README.md) and change the URLs in `config.ts`.

## Documentation

| Document | Content |
|---|---|
| [docs/architecture.md](docs/architecture.md) | data flow between Angular, n8n, Gemini and Supabase, frontend structure, decisions |
| [docs/api-contract.md](docs/api-contract.md) | JSON of the webhook, errors, cookbook queries, quota rules |
| [docs/database.md](docs/database.md) | tables, row level security, SQL |
| [n8n/README.md](n8n/README.md) | the workflows node by node, credentials, import and export |
| [docs/deployment.md](docs/deployment.md) | server, Caddy, GitHub Action |

## Project Structure

```
code-a-cuisine/
├── .github/workflows/  # deploy to the server on every push to main
├── docs/               # architecture, api contract, database, deployment
├── n8n/                # exported workflows (JSON) and their documentation
├── public/             # fonts, icons, images
└── src/
    ├── styles/         # design tokens, mixins, fluid sizing function, fonts
    └── app/
        ├── pages/      # one folder per route, loaded lazily
        ├── shared/     # button, logo, popup, pagination, back link, ...
        ├── services/   # signal stores, n8n and Supabase access
        ├── guards/     # keep the generator steps in order
        ├── models/     # types and interfaces
        ├── constants/  # options, limits, cuisine banner sizes
        ├── utils/      # formatting, validators, image loader, suggestions
        └── data/       # ingredient list for the suggestions
```

## Tech Decisions

- **n8n between the app and Gemini:** the API key never reaches the browser, and the quota cannot be bypassed from the frontend
- **Validation twice:** the frontend validates the form, n8n validates every field again for direct calls to the webhook. Whether the ingredients are enough is judged by Gemini in the same call
- **Quota by IP and browser id:** a random id in `localStorage` links the IPv4 and IPv6 address of one device to one user. Requests that fail in Gemini do not count
- **Supabase:** `range` and `count` make the paginated lists simple, n8n counts the quota with plain SQL. The browser can only read recipes and call `like_recipe`, everything else is blocked by row level security
- **Always generate new recipes:** stored recipes are never reused for a request, so every result fits exactly the entered ingredients
- **Signals everywhere:** state lives in small `@Service()` stores, components read it with `computed()`, data from Supabase loads with `resource()`
- **Own server instead of GitHub Pages:** Caddy answers deep links with `index.html` and status 200, caches hashed files for a year and compresses everything

## Notes

- The Supabase publishable key in `config.ts` is public by design, access is limited by row level security. The Gemini key, the database password and the SMTP login only live in n8n
- Gemini runs on the paid tier, about 1 cent per request, capped by the quota and a spending limit
- Tested in current Chrome and Edge

## Credits

- Design by Developer Akademie GmbH
- Ingredient suggestions based on [TheMealDB](https://www.themealdb.com) (`src/app/data/ingredients.json`)
- Fonts: [Quicksand](https://fonts.google.com/specimen/Quicksand) (SIL Open Font License) and [Ubuntu](https://design.ubuntu.com/font) (Ubuntu Font Licence), self-hosted and subset to Latin
