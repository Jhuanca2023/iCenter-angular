import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export default class AdminUsersComponent {
  searchTerm = '';

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Usuarios' }
  ];

  users: User[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Usuario', status: 'Activo', lastAccess: '4 may 2025', createdAt: new Date('2025-05-03') },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'Usuario', status: 'Activo', lastAccess: '3 may 2025', createdAt: new Date('2025-05-02') },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'Usuario', status: 'Activo', lastAccess: '4 may 2025', createdAt: new Date('2025-05-01') },
    { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'Administrador', status: 'Activo', lastAccess: '4 may 2025', createdAt: new Date('2025-04-28') },
    { id: 5, name: 'Luis González', email: 'luis@example.com', role: 'Usuario', status: 'Inactivo', lastAccess: 'Nunca', createdAt: new Date('2025-04-25') },
    { id: 6, name: 'Laura Sánchez', email: 'laura@example.com', role: 'Usuario', status: 'Activo', lastAccess: '3 may 2025', createdAt: new Date('2025-04-20') },
    { id: 7, name: 'Pedro López', email: 'pedro@example.com', role: 'Usuario', status: 'Activo', lastAccess: '4 may 2025', createdAt: new Date('2025-04-15') }
  ];

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
  }
}
