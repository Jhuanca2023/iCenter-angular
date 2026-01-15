import { Routes } from '@angular/router';
import AUTH_ROUTES from './modules/auth/auth.routes';
import { productsRoutes } from './modules/products/products.routes';
import { adminRoutes } from './modules/admin/admin.routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/layouts/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./modules/home/home.component').then(m => m.default)
      },
      {
        path: 'productos',
        children: productsRoutes
      }
    ]
  },
  {
    path: 'auth',
    children: AUTH_ROUTES
  },
  {
    path: 'admin',
    loadComponent: () => import('./shared/layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: adminRoutes
  }
];
