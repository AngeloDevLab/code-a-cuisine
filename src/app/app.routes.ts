import { Routes } from '@angular/router';
import { generationStartedGuard } from './guards/generation-started.guard';
import { hasIngredientsGuard } from './guards/has-ingredients.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'Code à Cuisine',
    loadComponent: () => import('./pages/hero/hero').then((m) => m.Hero),
  },
  {
    path: 'generator',
    title: 'Generate recipes | Code à Cuisine',
    loadComponent: () => import('./pages/generator/generator').then((m) => m.Generator),
  },
  {
    path: 'generator/preferences',
    title: 'Preferences | Code à Cuisine',
    canActivate: [hasIngredientsGuard],
    loadComponent: () => import('./pages/preferences/preferences').then((m) => m.Preferences),
  },
  {
    path: 'generator/loading',
    title: 'Cooking | Code à Cuisine',
    canActivate: [generationStartedGuard],
    loadComponent: () => import('./pages/loading/loading').then((m) => m.Loading),
  },
  {
    path: 'results',
    title: 'Your recipes | Code à Cuisine',
    loadComponent: () => import('./pages/results/results').then((m) => m.Results),
  },
  {
    path: 'cookbook',
    title: 'Cookbook | Code à Cuisine',
    loadComponent: () => import('./pages/cookbook/cookbook').then((m) => m.Cookbook),
  },
  {
    path: 'cookbook/:cuisine',
    title: 'Recipes | Code à Cuisine',
    loadComponent: () => import('./pages/recipe-list/recipe-list').then((m) => m.RecipeList),
  },
  {
    path: 'recipes/:id',
    title: 'Recipe | Code à Cuisine',
    loadComponent: () =>
      import('./pages/recipe-detail/recipe-detail').then((m) => m.RecipeDetail),
  },
  {
    path: 'imprint',
    title: 'Imprint | Code à Cuisine',
    loadComponent: () => import('./pages/imprint/imprint').then((m) => m.Imprint),
  },
  { path: '**', redirectTo: '' },
];
