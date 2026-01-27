import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { Order } from '../../../../core/interfaces';
import { OrdersService } from '../../../../core/services/orders.service';
import { Subscription } from 'rxjs';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BreadcrumbsComponent, PaginationComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export default class AdminOrdersComponent implements OnInit, OnDestroy {
  Math = Math;
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

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private ordersService: OrdersService) { }

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

  deleteOrder(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
      this.ordersService.delete(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== id);
          if (this.pagedOrders.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
        },
        error: (err) => {
          console.error('Error al eliminar el pedido:', err);
          alert('No se pudo eliminar el pedido.');
        }
      });
    }
  }

  statuses = ['Todos', 'Pendiente', 'Completado', 'Cancelado', 'En Proceso'];

  get filteredOrdersList(): Order[] {
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

  get pagedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrdersList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredOrdersList.length / this.itemsPerPage);
  }

  get pages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStatus = '';
    this.currentPage = 1;
  }
}
