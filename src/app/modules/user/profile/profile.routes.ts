import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile.component').then(m => m.ProfileComponent),
    children: [
      {
        path: '',
        redirectTo: 'editar',
        pathMatch: 'full'
      },
      {
        path: 'editar',
        loadComponent: () => import('./profile-edit/profile-edit.component').then(m => m.ProfileEditComponent)
      },
      {
        path: 'seguridad',
        loadComponent: () => import('./profile-security/profile-security.component').then(m => m.ProfileSecurityComponent)
      }
    ]
  }
];
