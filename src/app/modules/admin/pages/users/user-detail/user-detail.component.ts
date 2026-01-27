import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { User } from '../../../../../core/interfaces/user.interface';
import { UsersService } from '../../../../../core/services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export default class UserDetailComponent implements OnInit, OnDestroy {
  userId: string | null = null;
  user: User | null = null;
  isLoading = false;
  error: string | null = null;
  private routeSubscription?: Subscription;
  private dataSubscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Usuarios', route: '/admin/users' },
    { label: 'Detalle' }
  ];

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if (this.userId) {
        this.loadUserData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
    }
  }

  loadUserData(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.error = null;

    this.dataSubscription = this.usersService.getById(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando usuario:', err);
        this.error = 'Error al cargar el usuario. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = [
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  getAuthProviderLabel(): string {
    if (!this.user) return '';
    return this.user.authProvider === 'google' ? 'Google' : 'Email/Contraseña';
  }

  getAuthProviderBadgeClass(): string {
    if (!this.user) return '';
    return this.user.authProvider === 'google'
      ? 'px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800'
      : 'px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-800';
  }
}