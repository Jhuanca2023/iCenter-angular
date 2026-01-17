import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, AuthUser } from '../../../../../core/services/auth.service';
import { UsersService } from '../../../../../core/services/users.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-admin-profile-info',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <h3 class="text-lg font-semibold text-slate-900 mb-4">Información Personal</h3>
      
      <div *ngIf="currentUser" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Nombre Completo</label>
            <p class="text-slate-900">{{ currentUser.name }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <p class="text-slate-900">{{ currentUser.email }}</p>
          </div>
          
          <div *ngIf="userDetails">
            <div *ngIf="userDetails.phone">
              <label class="block text-sm font-medium text-slate-700 mb-2">Teléfono</label>
              <p class="text-slate-900">{{ userDetails.phone }}</p>
            </div>
            
            <div *ngIf="userDetails.address">
              <label class="block text-sm font-medium text-slate-700 mb-2">Dirección</label>
              <p class="text-slate-900">{{ userDetails.address }}</p>
            </div>
            
            <div *ngIf="userDetails.city">
              <label class="block text-sm font-medium text-slate-700 mb-2">Ciudad</label>
              <p class="text-slate-900">{{ userDetails.city }}</p>
            </div>
            
            <div *ngIf="userDetails.country">
              <label class="block text-sm font-medium text-slate-700 mb-2">País</label>
              <p class="text-slate-900">{{ userDetails.country }}</p>
            </div>
          </div>
        </div>
        
        <div class="pt-4 border-t border-gray-200">
          <a 
            routerLink="/admin/profile/editar"
            class="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            Editar Información
          </a>
        </div>
      </div>
    </div>
  `
})
export class AdminProfileInfoComponent implements OnInit, OnDestroy {
  currentUser: AuthUser | null = null;
  userDetails: any = null;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUser = user;
          this.loadUserDetails(user.id);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserDetails(userId: string): void {
    this.usersService.getById(userId).subscribe({
      next: (user) => {
        if (user) {
          this.userDetails = user;
        }
      },
      error: (err) => {
        console.error('Error al cargar detalles:', err);
      }
    });
  }
}

export default AdminProfileInfoComponent;
