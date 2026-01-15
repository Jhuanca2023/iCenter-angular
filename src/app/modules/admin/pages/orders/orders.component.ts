import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export default class AdminOrdersComponent {
  orders = [
    { id: 1, customer: 'Juan Pérez', total: 150, status: 'Pendiente', date: '2024-01-15' },
    { id: 2, customer: 'María García', total: 250, status: 'Completado', date: '2024-01-14' },
    { id: 3, customer: 'Carlos Rodríguez', total: 89.99, status: 'Completado', date: '2024-01-13' },
    { id: 4, customer: 'Ana Martínez', total: 1299.99, status: 'Pendiente', date: '2024-01-12' },
    { id: 5, customer: 'Luis González', total: 349.99, status: 'Completado', date: '2024-01-11' },
    { id: 6, customer: 'Laura Sánchez', total: 199.99, status: 'Pendiente', date: '2024-01-10' }
  ];
}
