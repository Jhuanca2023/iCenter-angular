import { Routes } from '@angular/router';

export const claimsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/claims-landing/claims-landing.component').then(m => m.ClaimsLandingComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/complaint-book-form/complaint-book-form.component').then(m => m.ComplaintBookFormComponent)
  },
  {
    path: 'track/:code',
    loadComponent: () => import('./pages/complaint-book-tracking/complaint-book-tracking.component').then(m => m.ComplaintBookTrackingComponent)
  },
  {
    path: 'track',
    loadComponent: () => import('./pages/complaint-book-tracking/complaint-book-tracking.component').then(m => m.ComplaintBookTrackingComponent)
  }
];
