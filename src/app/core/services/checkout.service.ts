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

    // Usamos fetch directo para evitar que el cliente de Supabase inyecte un token de sesión roto/expirado
    // que está causando el error 401 Unauthorized.
    return from(
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': environment.supabaseAnonKey
        },
        body: JSON.stringify({ customer, items })
      }).then(async (res) => {
        const result = await res.json();
        if (!res.ok) throw new Error(result.error || 'Error en el servidor');
        return result.data as CheckoutInitResponse;
      })
    );
  }
}
