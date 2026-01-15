import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { Order } from '../../interfaces/order.interface';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export default class AdminOrdersComponent {
  searchTerm = '';
  selectedStatus = '';

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Pedidos' }
  ];

  orders: Order[] = [
    { id: '1', customer: 'Juan Pérez', total: 150, status: 'Pendiente', date: '2024-01-15' },
    { id: '2', customer: 'María García', total: 250, status: 'Completado', date: '2024-01-14' },
    { id: '3', customer: 'Carlos Rodríguez', total: 89.99, status: 'Completado', date: '2024-01-13' },
    { id: '4', customer: 'Ana Martínez', total: 1299.99, status: 'Pendiente', date: '2024-01-12' },
    { id: '5', customer: 'Luis González', total: 349.99, status: 'Completado', date: '2024-01-11' },
    { id: '6', customer: 'Laura Sánchez', total: 199.99, status: 'Pendiente', date: '2024-01-10' }
  ];

  statuses = ['Todos', 'Pendiente', 'Completado', 'Cancelado', 'En Proceso'];

  get filteredOrders(): Order[] {
    let filtered = [...this.orders];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(o => 
        o.customer.toLowerCase().includes(term) ||
        o.id.toString().includes(term)
      );
    }

    if (this.selectedStatus && this.selectedStatus !== 'Todos') {
      filtered = filtered.filter(o => o.status === this.selectedStatus);
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
  }
}
