import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartState, CartItem } from '../../core/interfaces/cart.interface';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export default class CartComponent implements OnInit, OnDestroy {
  cart: CartState = {
    items: [],
    totalQuantity: 0,
    totalAmount: 0
  };
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart = cart;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isEmpty(): boolean {
    return this.cart.totalQuantity === 0;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateItemQuantity(
      item.id,
      item.quantity + 1
    );
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity <= 1) {
      this.removeItem(item);
      return;
    }
    this.cartService.updateItemQuantity(
      item.id,
      item.quantity - 1
    );
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item.id);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}

