import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckoutCustomerInfo, ShippingType } from '@core/interfaces/checkout.interface';

@Component({
  selector: 'app-shipping-step',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './shipping-step.component.html'
})
export class ShippingStepComponent {
  @Input() cartTotal = 0;
  @Output() next = new EventEmitter<CheckoutCustomerInfo>();

  readonly shippingNormal = 15;
  readonly shippingExpress = 25;

  form: any; // Se inicializará en el constructor

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(6)]],
      country: ['Perú', [Validators.required]],
      city: ['', [Validators.required]],
      addressLine1: ['', [Validators.required]],
      addressLine2: [''],
      postalCode: [''],
      shippingType: ['normal' as ShippingType, [Validators.required]]
    });
  }

  get shippingCost(): number {
    return this.form.value.shippingType === 'express' ? this.shippingExpress : this.shippingNormal;
  }

  get total(): number {
    return this.cartTotal + this.shippingCost;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    const payload: CheckoutCustomerInfo = {
      fullName: v.fullName!,
      email: v.email!,
      phone: v.phone!,
      shippingType: v.shippingType!,
      address: {
        country: v.country!,
        city: v.city!,
        addressLine1: v.addressLine1!,
        addressLine2: v.addressLine2 || undefined,
        postalCode: v.postalCode || undefined
      }
    };

    this.next.emit(payload);
  }
}
