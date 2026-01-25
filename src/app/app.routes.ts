import { Routes } from '@angular/router';
import AUTH_ROUTES from './modules/auth/auth.routes';
import { productsRoutes } from './modules/products/products.routes';
import { adminRoutes } from './modules/admin/admin.routes';
import { adminGuard } from './core/guards/auth.guard';

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
      },
      {
        path: 'carrito',
        loadComponent: () => import('./modules/cart/cart.component').then(m => m.default)
      },
      {
        path: 'checkout',
        loadChildren: () => import('./modules/checkout/checkout.module').then(m => m.CheckoutModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('./modules/user/profile/profile.routes').then(m => m.profileRoutes)
      },
      {
        path: 'pedidos',
        loadChildren: () => import('./modules/user/orders/orders.routes').then(m => m.ordersRoutes)
      },
      {
        path: 'complaint-book',
        loadChildren: () => import('./modules/claims/claims.routes').then(m => m.claimsRoutes)
      },
      {
        path: 'favoritos',
        loadComponent: () => import('./modules/favorites/components/favorites-page/favorites-page.component').then(m => m.FavoritesPageComponent)
      },
      {
        path: 'nosotros',
        loadComponent: () => import('./modules/public/nosotros/nosotros.component').then(m => m.default)
      },
      {
        path: 'eventos',
        loadComponent: () => import('./modules/public/eventos/eventos.component').then(m => m.default)
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
    canActivate: [adminGuard],
    children: adminRoutes
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.default)
  }
];
