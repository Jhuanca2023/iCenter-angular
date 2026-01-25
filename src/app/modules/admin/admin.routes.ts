import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.default)
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.component').then(m => m.default)
  },
  {
    path: 'productos/create',
    loadComponent: () => import('./pages/productos/product-create/product-create.component').then(m => m.default)
  },
  {
    path: 'productos/edit/:id',
    loadComponent: () => import('./pages/productos/product-edit/product-edit.component').then(m => m.default)
  },
  {
    path: 'productos/detail/:id',
    loadComponent: () => import('./pages/productos/product-detail/product-detail.component').then(m => m.default)
  },
  {
    path: 'productos/delete/:id',
    loadComponent: () => import('./pages/productos/product-delete/product-delete.component').then(m => m.default)
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.component').then(m => m.default)
  },
  {
    path: 'categories/create',
    loadComponent: () => import('./pages/categories/category-create/category-create.component').then(m => m.default)
  },
  {
    path: 'categories/edit/:id',
    loadComponent: () => import('./pages/categories/category-edit/category-edit.component').then(m => m.default)
  },
  {
    path: 'categories/detail/:id',
    loadComponent: () => import('./pages/categories/category-detail/category-detail.component').then(m => m.default)
  },
  {
    path: 'categories/delete/:id',
    loadComponent: () => import('./pages/categories/category-delete/category-delete.component').then(m => m.default)
  },
  {
    path: 'marcas',
    loadComponent: () => import('./pages/marcas/marcas.component').then(m => m.default)
  },
  {
    path: 'marcas/create',
    loadComponent: () => import('./pages/marcas/marca-create/marca-create.component').then(m => m.default)
  },
  {
    path: 'marcas/edit/:id',
    loadComponent: () => import('./pages/marcas/marca-edit/marca-edit.component').then(m => m.default)
  },
  {
    path: 'marcas/detail/:id',
    loadComponent: () => import('./pages/marcas/marca-detail/marca-detail.component').then(m => m.default)
  },
  {
    path: 'marcas/delete/:id',
    loadComponent: () => import('./pages/marcas/marca-delete/marca-delete.component').then(m => m.default)
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.default)
  },
  {
    path: 'users/create',
    loadComponent: () => import('./pages/users/user-create/user-create.component').then(m => m.default)
  },
  {
    path: 'users/edit/:id',
    loadComponent: () => import('./pages/users/user-edit/user-edit.component').then(m => m.default)
  },
  {
    path: 'users/detail/:id',
    loadComponent: () => import('./pages/users/user-detail/user-detail.component').then(m => m.default)
  },
  {
    path: 'users/delete/:id',
    loadComponent: () => import('./pages/users/user-delete/user-delete.component').then(m => m.default)
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders.component'),
  },
  {
    path: 'orders/detail/:id',
    loadComponent: () => import('./pages/orders/order-detail/order-detail.component').then(m => m.AdminOrderDetailComponent)
  },
  {
    path: 'reclamos',
    loadComponent: () => import('./pages/reclamos/claims-list/claims-list.component').then(m => m.ClaimsListComponent)
  },
  {
    path: 'reclamos/pendientes',
    loadComponent: () => import('./pages/reclamos/pendientes/pendientes.component').then(m => m.ClaimsPendientesComponent)
  },
  {
    path: 'reclamos/en-proceso',
    loadComponent: () => import('./pages/reclamos/en-proceso/en-proceso.component').then(m => m.ClaimsEnProcesoComponent)
  },
  {
    path: 'reclamos/completados',
    loadComponent: () => import('./pages/reclamos/completados/completados.component').then(m => m.ClaimsCompletadosComponent)
  },
  {
    path: 'reclamos/archivados',
    loadComponent: () => import('./pages/reclamos/archivados/archivados.component').then(m => m.ArchivadosComponent)
  },
  {
    path: 'reclamos/:id',
    loadComponent: () => import('./pages/reclamos/claim-detail/claim-detail.component').then(m => m.ClaimDetailComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.AdminProfileComponent),
    children: [
      {
        path: '',
        redirectTo: 'informacion',
        pathMatch: 'full'
      },
      {
        path: 'informacion',
        loadComponent: () => import('./pages/profile/profile-info/profile-info.component').then(m => m.AdminProfileInfoComponent)
      },
      {
        path: 'editar',
        loadComponent: () => import('./pages/profile/profile-edit/profile-edit.component').then(m => m.AdminProfileEditComponent)
      },
      {
        path: 'seguridad',
        loadComponent: () => import('./pages/profile/profile-security/profile-security.component').then(m => m.AdminProfileSecurityComponent)
      }
    ]
  },
  {
    path: 'banners',
    loadComponent: () => import('./pages/banners/banners.component').then(m => m.BannersComponent)
  }
];
