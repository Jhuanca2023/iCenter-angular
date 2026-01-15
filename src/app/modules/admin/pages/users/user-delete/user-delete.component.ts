import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { User } from '../../../interfaces/user.interface';
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
  private routeSubscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Usuarios', route: '/admin/users' },
    { label: 'Eliminar' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
      this.loadUserData();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  loadUserData(): void {
    // Mock data
    this.user = {
      id: parseInt(this.userId || '1'),
      name: 'Juan Pérez',
      email: 'juan@example.com',
      role: 'Usuario',
      status: 'Activo'
    };
  }

  confirmDelete(): void {
    console.log('Usuario eliminado:', this.userId);
    this.router.navigate(['/admin/users']);
  }

  cancelDelete(): void {
    this.router.navigate(['/admin/users']);
  }
}