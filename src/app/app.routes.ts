import { Routes } from '@angular/router';
import AUTH_ROUTES from './modules/auth/auth.routes';
import { productsRoutes } from './modules/products/products.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/home/home.component').then(m => m.default)
  },
  {
    path: 'productos',
    children: productsRoutes
  },
  {
    path: 'auth',
    children: AUTH_ROUTES
  }
];
