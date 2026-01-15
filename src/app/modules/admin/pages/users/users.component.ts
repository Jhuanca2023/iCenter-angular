import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export default class AdminUsersComponent {
  users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 'Usuario', status: 'Activo' },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 'Usuario', status: 'Activo' },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'Usuario', status: 'Activo' },
    { id: 4, name: 'Ana Martínez', email: 'ana@example.com', role: 'Admin', status: 'Activo' },
    { id: 5, name: 'Luis González', email: 'luis@example.com', role: 'Usuario', status: 'Inactivo' },
    { id: 6, name: 'Laura Sánchez', email: 'laura@example.com', role: 'Usuario', status: 'Activo' },
    { id: 7, name: 'Pedro López', email: 'pedro@example.com', role: 'Usuario', status: 'Activo' }
  ];
}
