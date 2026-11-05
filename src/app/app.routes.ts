import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home.page').then((m) => m.HomePage) },
  { path: 'seance', loadComponent: () => import('./pages/session.page').then((m) => m.SessionPage) },
  { path: 'exos', loadComponent: () => import('./pages/library.page').then((m) => m.LibraryPage) },
  { path: 'exos/:id', loadComponent: () => import('./pages/exercise.page').then((m) => m.ExercisePage) },
  { path: 'journal', loadComponent: () => import('./pages/journal.page').then((m) => m.JournalPage) },
  { path: 'carburant', loadComponent: () => import('./pages/fuel.page').then((m) => m.FuelPage) },
  { path: 'profil', loadComponent: () => import('./pages/profile.page').then((m) => m.ProfilePage) },
  { path: '**', redirectTo: '' },
];
