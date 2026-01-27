import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { User } from '../../../../../core/interfaces/user.interface';
import { UsersService } from '../../../../../core/services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './user-delete.component.html',
  styleUrl: './user-delete.component.css'
})
export default class UserDeleteComponent implements OnInit, OnDestroy {
  userId: string | null = null;
  user: User | null = null;
  showConfirmModal = true;
  isLoading = false;
  error: string | null = null;
  private routeSubscription?: Subscription;
  private dataSubscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Usuarios', route: '/admin/users' },
    { label: 'Eliminar' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

  confirmDelete(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.error = null;

    this.usersService.delete(this.userId).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        console.error('Error eliminando usuario:', err);
        this.error = 'Error al eliminar el usuario. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  cancelDelete(): void {
    this.router.navigate(['/admin/users']);
  }
}