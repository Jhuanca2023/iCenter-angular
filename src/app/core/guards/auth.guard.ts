import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya hay un usuario cargado, permitir acceso
  if (authService.isLoggedIn()) {
    return true;
  }

  // Si no hay usuario pero hay sesión en Supabase, cargarla primero
  return authService.checkSessionAsync().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }
      router.navigate(['/auth'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }),
    catchError(() => {
      router.navigate(['/auth'], {
        queryParams: { returnUrl: state.url }
      });
      return of(false);
    })
  );
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si ya hay un usuario cargado y es admin, permitir acceso
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true;
  }

  // Si hay usuario pero no es admin, redirigir
  if (authService.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  // Si no hay usuario pero hay sesión en Supabase, cargarla primero
  return authService.checkSessionAsync().pipe(
    map(isAuthenticated => {
      if (isAuthenticated && authService.isAdmin()) {
        return true;
      }
      
      if (isAuthenticated) {
        router.navigate(['/']);
        return false;
      }
      
      router.navigate(['/auth'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }),
    catchError(() => {
      router.navigate(['/auth'], {
        queryParams: { returnUrl: state.url }
      });
      return of(false);
    })
  );
};
