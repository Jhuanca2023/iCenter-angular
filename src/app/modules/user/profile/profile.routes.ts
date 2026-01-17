import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./profile.component').then(m => m.ProfileComponent),
    children: [
      {
        path: '',
        redirectTo: 'informacion',
        pathMatch: 'full'
      },
      {
        path: 'informacion',
        loadComponent: () => import('./profile-info/profile-info.component').then(m => m.ProfileInfoComponent)
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
