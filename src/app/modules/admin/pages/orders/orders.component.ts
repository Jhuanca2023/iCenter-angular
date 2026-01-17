import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { Order } from '../../interfaces/order.interface';
import { OrdersService } from '../../../../core/services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export default class AdminOrdersComponent implements OnInit, OnDestroy {
  searchTerm = '';
  selectedStatus = '';

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Pedidos' }
  ];

  orders: Order[] = [];
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    
    this.subscription = this.ordersService.getAll().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando pedidos:', err);
        this.error = 'Error al cargar los pedidos. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

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
