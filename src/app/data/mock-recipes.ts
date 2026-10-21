import { Recipe } from '../models/recipe';

/** Placeholder recipes used until the n8n webhook delivers real ones. */
export const MOCK_RECIPES: Recipe[] = [
  {
    id: 'mock-1',
    title: 'Spaghetti al Pomodoro',
    cookingTimeMinutes: 20,
    cookingTime: 'quick',
    cuisine: 'italian',
    diet: 'vegetarian',
    portions: 2,
    cooks: 2,
    likes: 0,
    nutrition: { perPortion: { energyKcal: 540, proteinG: 18, fatG: 12, carbsG: 88 } },
    ingredients: {
      yours: [
        { name: 'Pasta', amount: 250, unit: 'g' },
        { name: 'Cherry tomatoes', amount: 300, unit: 'g' },
        { name: 'Baby spinach', amount: 100, unit: 'g' },
      ],
      extra: [
        { name: 'Olive oil', amount: 30, unit: 'ml' },
        { name: 'Garlic', amount: 2, unit: 'pcs' },
      ],
    },
    steps: [
      { order: 1, cook: 1, text: 'Bring a large pot of salted water to a boil.', parallel: false },
      { order: 2, cook: 2, text: 'Halve the cherry tomatoes and slice the garlic.', parallel: true },
      { order: 3, cook: 1, text: 'Cook the pasta until al dente.', parallel: false },
      { order: 4, cook: 2, text: 'Fry the garlic in olive oil, add the tomatoes and let them soften.', parallel: true },
      { order: 5, cook: 1, text: 'Toss the pasta with the sauce and the spinach until it wilts.', parallel: false },
    ],
  },
  {
    id: 'mock-2',
    title: 'Creamy Spinach Egg Curry',
    cookingTimeMinutes: 35,
    cookingTime: 'medium',
    cuisine: 'indian',
    diet: 'vegetarian',
    portions: 2,
    cooks: 3,
    likes: 0,
    nutrition: { perPortion: { energyKcal: 460, proteinG: 22, fatG: 26, carbsG: 34 } },
    ingredients: {
      yours: [
        { name: 'Egg', amount: 4, unit: 'pcs' },
        { name: 'Baby spinach', amount: 150, unit: 'g' },
        { name: 'Cherry tomatoes', amount: 200, unit: 'g' },
      ],
      extra: [
        { name: 'Coconut milk', amount: 200, unit: 'ml' },
        { name: 'Onion', amount: 1, unit: 'pcs' },
        { name: 'Curry powder', amount: 10, unit: 'g' },
      ],
    },
    steps: [
      { order: 1, cook: 1, text: 'Boil the eggs for 9 minutes, then cool and peel them.', parallel: false },
      { order: 2, cook: 2, text: 'Dice the onion and the tomatoes.', parallel: true },
      { order: 3, cook: 3, text: 'Wash the spinach and chop it roughly.', parallel: true },
      { order: 4, cook: 2, text: 'Fry the onion, add the curry powder and the tomatoes.', parallel: false },
      { order: 5, cook: 2, text: 'Pour in the coconut milk and simmer for 10 minutes.', parallel: false },
      { order: 6, cook: 1, text: 'Stir in the spinach, add the halved eggs and warm through.', parallel: false },
    ],
  },
  {
    id: 'mock-3',
    title: 'Pastrami Egg Bowl',
    cookingTimeMinutes: 15,
    cookingTime: 'quick',
    cuisine: 'fusion',
    diet: 'none',
    portions: 2,
    cooks: 1,
    likes: 0,
    nutrition: { perPortion: { energyKcal: 610, proteinG: 34, fatG: 24, carbsG: 62 } },
    ingredients: {
      yours: [
        { name: 'Pasta', amount: 200, unit: 'g' },
        { name: 'Egg', amount: 2, unit: 'pcs' },
        { name: 'Baby spinach', amount: 80, unit: 'g' },
      ],
      extra: [{ name: 'Soy sauce', amount: 20, unit: 'ml' }],
    },
    steps: [
      { order: 1, cook: 1, text: 'Cook the pasta and drain it.', parallel: false },
      { order: 2, cook: 1, text: 'Fry the eggs sunny side up.', parallel: false },
      { order: 3, cook: 1, text: 'Toss the pasta with spinach and soy sauce, top with the eggs.', parallel: false },
    ],
  },
];
