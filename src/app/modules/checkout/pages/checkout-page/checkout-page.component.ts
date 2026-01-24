import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { CartService } from '../../../../core/services/cart.service';
import { CartState } from '../../../../core/interfaces/cart.interface';
import { CheckoutCustomerInfo, CheckoutInitResponse } from '../../../../core/interfaces/checkout.interface';
import { CheckoutService } from '../../../../core/services/checkout.service';

import { ShippingStepComponent } from '../../shipping/shipping-step.component';
import { PaymentStepComponent } from '../../payment/payment-step.component';
import { ReviewStepComponent } from '../../review/review-step.component';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [CommonModule, RouterModule, ShippingStepComponent, PaymentStepComponent, ReviewStepComponent],
  templateUrl: './checkout-page.component.html'
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  cart: CartState = { items: [], totalQuantity: 0, totalAmount: 0 };
  step: 1 | 2 | 3 = 1;

  customerInfo: CheckoutCustomerInfo | null = null;
  initResponse: CheckoutInitResponse | null = null;

  isLoading = false;
  error: string | null = null;

  paymentStatus: 'idle' | 'processing' | 'succeeded' | 'failed' = 'idle';

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart: CartState) => {
        this.cart = cart;
        if (this.cart.totalQuantity === 0) {
          this.router.navigateByUrl('/carrito');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onShippingNext(customer: CheckoutCustomerInfo): void {
    this.error = null;
    this.isLoading = true;
    this.customerInfo = customer;

    this.checkoutService
      .initCheckout(customer, this.cart.items)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: CheckoutInitResponse) => {
          this.initResponse = resp;
          this.step = 2;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Checkout init error:', err);
          this.error = 'No se pudo iniciar el checkout. Intenta nuevamente.';
          this.isLoading = false;
        }
      });
  }

  onPaymentBack(): void {
    this.step = 1;
  }

  onPaymentResult(result: { status: 'processing' | 'succeeded' | 'failed'; message?: string }): void {
    if (result.status === 'failed') {
      this.paymentStatus = 'failed';
      this.error = result.message || 'El pago falló. Verifica tu tarjeta e intenta nuevamente.';
      return;
    }

    this.paymentStatus = result.status === 'succeeded' ? 'succeeded' : 'processing';
    this.error = null;

    if (result.status === 'succeeded') {
      this.cartService.clearCart();
    }

    this.step = 3;
  }

  restart(): void {
    this.customerInfo = null;
    this.initResponse = null;
    this.paymentStatus = 'idle';
    this.error = null;
    this.step = 1;
  }
}
