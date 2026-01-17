import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-slate-100">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p class="text-slate-600">Iniciando sesión...</p>
      </div>
    </div>
  `
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Manejar el callback de OAuth
    this.authService.handleAuthCallback().subscribe({
      next: (user) => {
        if (user) {
          // Esperar un momento para que se actualice la sesión y se cargue el rol completo
          setTimeout(() => {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser?.role === 'Administrador') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }, 1000);
        } else {
          console.warn('No se pudo obtener el usuario del callback');
          this.router.navigate(['/auth']);
        }
      },
      error: (err) => {
        console.error('Error en callback:', err);
        // Intentar obtener el usuario actual de todas formas
        setTimeout(() => {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            if (currentUser.role === 'Administrador') {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.router.navigate(['/auth']);
          }
        }, 1000);
      }
    });
  }
}
