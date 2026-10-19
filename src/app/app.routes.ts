import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Code-a-Cuisine',
    loadComponent: () => import('./pages/generator/generator').then((m) => m.Generator),
  },
  {
    path: 'results',
    title: 'Your recipes | Code-a-Cuisine',
    loadComponent: () => import('./pages/results/results').then((m) => m.Results),
  },
  {
    path: 'recipes',
    title: 'Recipe library | Code-a-Cuisine',
    loadComponent: () => import('./pages/library/library').then((m) => m.Library),
  },
  {
    path: 'recipes/:id',
    title: 'Recipe | Code-a-Cuisine',
    loadComponent: () =>
      import('./pages/recipe-detail/recipe-detail').then((m) => m.RecipeDetail),
  },
  {
    path: 'imprint',
    title: 'Imprint | Code-a-Cuisine',
    loadComponent: () => import('./pages/imprint/imprint').then((m) => m.Imprint),
  },
  { path: '**', redirectTo: '' },
];
