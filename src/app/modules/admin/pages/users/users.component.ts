import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { User } from '../../interfaces/user.interface';
import { UsersService } from '../../../../core/services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BreadcrumbsComponent, PaginationComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export default class AdminUsersComponent implements OnInit, OnDestroy {
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Usuarios' }
  ];

  users: User[] = [];
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.subscription = this.usersService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.error = 'Error al cargar los usuarios. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  selectedFilter: 'todos' | 'activos' | 'inactivos' = 'todos';

  get filteredUsers(): User[] {
    let filtered = [...this.users];
    
    if (this.selectedFilter === 'activos') {
      filtered = filtered.filter(u => u.status === 'Activo');
    } else if (this.selectedFilter === 'inactivos') {
      filtered = filtered.filter(u => u.status === 'Inactivo');
    }
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredUsers.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get activeCount(): number {
    return this.users.filter(u => u.status === 'Activo').length;
  }

  get inactiveCount(): number {
    return this.users.filter(u => u.status === 'Inactivo').length;
  }

  getTotalCount(): number {
    return this.users.length;
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

  setFilter(filter: 'todos' | 'activos' | 'inactivos'): void {
    this.selectedFilter = filter;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFilter = 'todos';
    this.currentPage = 1;
  }
}
