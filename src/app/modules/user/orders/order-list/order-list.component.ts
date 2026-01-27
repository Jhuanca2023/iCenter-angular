import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { OrdersService } from '../../../../core/services/orders.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { Order } from '../../../../core/interfaces';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  isLoading = true;
  currentUserId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUserOrders(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUserId = user.id;
          this.ordersService.getByUserId(user.id).subscribe({
            next: (orders) => {
              this.orders = orders;
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error al cargar pedidos:', err);
              this.isLoading = false;
            }
          });
        } else {
          this.isLoading = false;
        }
      });
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'Pendiente': 'bg-yellow-100 text-yellow-800',
      'Confirmado': 'bg-blue-100 text-blue-800',
      'En preparación': 'bg-purple-100 text-purple-800',
      'En camino': 'bg-indigo-100 text-indigo-800',
      'Entregado': 'bg-green-100 text-green-800',
      'Cancelado': 'bg-red-100 text-red-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  }

  resumeOrder(order: Order): void {
    this.cartService.clearCart();
    if (order.items) {
      order.items.forEach(item => {
        this.cartService.addItem({
          id: item.productId,
          name: item.productName,
          price: item.price,
          originalPrice: item.price,
          image: item.productImage || ''
        }, item.quantity);
      });
      this.router.navigate(['/checkout']);
    }
  }
}
