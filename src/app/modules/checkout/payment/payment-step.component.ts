import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { environment } from '../../../../environments/environment';
import { CheckoutTotals } from '@core/interfaces/checkout.interface';

@Component({
  selector: 'app-payment-step',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-step.component.html',
  styleUrl: './payment-step.component.css'
})
export class PaymentStepComponent implements AfterViewInit, OnChanges {
  @Input() clientSecret = '';
  @Input() totals: CheckoutTotals | null = null;
  @Input() expiresAt = '';
  @Input() customerEmail = '';

  @Output() back = new EventEmitter<void>();
  @Output() result = new EventEmitter<{ status: 'processing' | 'succeeded' | 'failed'; message?: string }>();

  @ViewChild('paymentElementContainer') paymentElementContainer?: ElementRef<HTMLDivElement>;

  private stripePromise = loadStripe((environment as any).stripePublishableKey || '');
  private stripe: Stripe | null = null;
  private elements: StripeElements | null = null;
  private mounted = false;

  isProcessing = false;
  isStripeReady = false; // Nueva bandera
  error: string | null = null;

  async ngAfterViewInit(): Promise<void> {
    await this.setup();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['clientSecret']?.currentValue && !changes['clientSecret'].firstChange) {
      this.mounted = false;
      await this.setup();
    }
  }

  async setup(): Promise<void> {
    this.error = null;

    if (!this.clientSecret) return;

    if (!this.paymentElementContainer?.nativeElement) {
      setTimeout(() => this.setup(), 50);
      return;
    }

    const publishableKey = (environment as any).stripePublishableKey;
    if (!publishableKey) {
      this.error = 'Stripe publishable key no configurada.';
      return;
    }

    if (this.mounted) return;

    this.stripe = await this.stripePromise;
    if (!this.stripe) {
      this.error = 'No se pudo inicializar Stripe.';
      return;
    }

    this.elements = this.stripe.elements({
      clientSecret: this.clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#4f46e5',
          borderRadius: '8px',
        }
      }
    });

    const paymentElement = this.elements.create('payment');
    paymentElement.mount(this.paymentElementContainer.nativeElement);

    paymentElement.on('ready', () => {
      this.isStripeReady = true;
    });

    this.mounted = true;
  }

  async pay(): Promise<void> {
    this.error = null;

    if (!this.stripe || !this.elements) {
      this.error = 'Stripe no está listo.';
      return;
    }

    this.isProcessing = true;

    try {
      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements: this.elements,
        confirmParams: {
          receipt_email: this.customerEmail || undefined
        },
        redirect: 'if_required'
      });

      if (error) {
        this.isProcessing = false;
        this.error = error.message || 'Pago rechazado.';
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        this.result.emit({ status: 'succeeded' });
      } else {
        this.isProcessing = false;
        this.error = 'Estado del pago: ' + (paymentIntent?.status || 'desconocido');
      }
    } catch (err: any) {
      this.isProcessing = false;
      this.error = 'Error inesperado: ' + (err.message || 'Intente nuevamente');
    }
  }
}
