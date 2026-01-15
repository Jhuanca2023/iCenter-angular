import { Routes } from '@angular/router';

export const productsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/product-list/product-list.component').then(m => m.default)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.default)
  }
];
