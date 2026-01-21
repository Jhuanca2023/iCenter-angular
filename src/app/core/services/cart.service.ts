import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image?: string;
}

export interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'icenter_cart';
  private cartSubject = new BehaviorSubject<CartState>(this.loadCartFromStorage());
  cart$ = this.cartSubject.asObservable();

  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1): void {
    const current = this.cartSubject.getValue();
    const items = [...current.items];

    const index = items.findIndex(i => i.id === item.id);
    if (index > -1) {
      items[index] = {
        ...items[index],
        quantity: items[index].quantity + quantity
      };
    } else {
      items.push({
        ...item,
        quantity
      });
    }

    this.updateCart(items);
  }

  removeItem(id: string | number): void {
    const current = this.cartSubject.getValue();
    const items = current.items.filter(i => i.id !== id);
    this.updateCart(items);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  updateItemQuantity(id: string | number, quantity: number): void {
    const current = this.cartSubject.getValue();
    const items = current.items
      .map(item => item.id === id ? { ...item, quantity } : item)
      .filter(item => item.quantity > 0);
    this.updateCart(items);
  }

  private updateCart(items: CartItem[]): void {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const newState: CartState = {
      items,
      totalQuantity,
      totalAmount
    };

    this.cartSubject.next(newState);
    this.saveCartToStorage(newState);
  }

  private loadCartFromStorage(): CartState {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) {
        return {
          items: [],
          totalQuantity: 0,
          totalAmount: 0
        };
      }
      const parsed = JSON.parse(stored) as CartState;
      if (!parsed.items || !Array.isArray(parsed.items)) {
        return {
          items: [],
          totalQuantity: 0,
          totalAmount: 0
        };
      }
      const totalQuantity = parsed.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
      const totalAmount = parsed.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
      return {
        items: parsed.items,
        totalQuantity,
        totalAmount
      };
    } catch {
      return {
        items: [],
        totalQuantity: 0,
        totalAmount: 0
      };
    }
  }

  private saveCartToStorage(cart: CartState): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cart));
    } catch {
    }
  }
}