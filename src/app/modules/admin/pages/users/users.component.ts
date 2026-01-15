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
  selectedRole = '';
  selectedStatus = '';

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Usuarios' }
  ];

  users: User[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Usuario', status: 'Activo' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'Usuario', status: 'Activo' },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'Usuario', status: 'Activo' },
    { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'Admin', status: 'Activo' },
    { id: 5, name: 'Luis González', email: 'luis@example.com', role: 'Usuario', status: 'Inactivo' },
    { id: 6, name: 'Laura Sánchez', email: 'laura@example.com', role: 'Usuario', status: 'Activo' },
    { id: 7, name: 'Pedro López', email: 'pedro@example.com', role: 'Usuario', status: 'Activo' }
  ];

  roles = ['Todos', 'Admin', 'Usuario'];
  statuses = ['Todos', 'Activo', 'Inactivo'];

  get filteredUsers(): User[] {
    let filtered = [...this.users];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    }

    if (this.selectedRole && this.selectedRole !== 'Todos') {
      filtered = filtered.filter(u => u.role === this.selectedRole);
    }

    if (this.selectedStatus && this.selectedStatus !== 'Todos') {
      filtered = filtered.filter(u => u.status === this.selectedStatus);
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
  }
}
