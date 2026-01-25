import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { CartItem } from '../interfaces/cart.interface';
import { CheckoutCustomerInfo, CheckoutInitResponse, CheckoutItemInput } from '../interfaces/checkout.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private supabase: SupabaseClient = getSupabaseClient();

  initCheckout(customer: CheckoutCustomerInfo, cartItems: CartItem[]): Observable<CheckoutInitResponse> {
    const items: CheckoutItemInput[] = cartItems.map(i => ({
      productId: String(i.id),
      quantity: i.quantity
    }));

    const url = `${environment.supabaseUrl}/functions/v1/checkout-init`;

    return from(this.getInitCheckoutRequest(url, customer, items));
  }

  private async getInitCheckoutRequest(url: string, customer: any, items: any[]): Promise<CheckoutInitResponse> {
    const session = await this.supabase.auth.getSession();
    const token = session.data.session?.access_token || '';

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': environment.supabaseAnonKey,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ customer, items })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Error en el servidor');
    return result.data as CheckoutInitResponse;
  }
}
