import { Injectable } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Order } from '../../modules/admin/interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private supabase: SupabaseClient = getSupabaseClient();

  getAll(): Observable<Order[]> {
    return from(
      this.supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .order('created_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToOrders(response.data || []);
      })
    );
  }

  getById(id: string): Observable<Order | null> {
    return from(
      this.supabase
        .from('orders')
        .select('*, order_items(*, products(*))')
        .eq('id', id)
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data ? this.mapToOrder(response.data) : null;
      })
    );
  }

  create(order: Partial<Order>): Observable<Order> {
    const orderData = {
      user_id: order.userId || null,
      customer_name: order.customer,
      customer_email: order.customerEmail || order.customer,
      total: order.total,
      status: order.status || 'Pendiente'
    };

    return from(
      this.supabase
        .from('orders')
        .insert(orderData)
        .select('*, order_items(*)')
        .single()
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        
        // Guardar items del pedido
        if (order.items && order.items.length > 0) {
          const itemsData = order.items.map(item => ({
            order_id: response.data.id,
            product_id: item.productId,
            product_color_id: item.colorId || null,
            quantity: item.quantity,
            price: item.price
          }));

          return from(
            this.supabase.from('order_items').insert(itemsData)
          ).pipe(
            map(() => response.data)
          );
        }
        
        return from([response.data]);
      }),
      map(orderData => this.mapToOrder(orderData))
    );
  }

  update(id: string, order: Partial<Order>): Observable<Order> {
    const orderData: any = {};
    if (order.status) orderData.status = order.status;
    if (order.customer) orderData.customer_name = order.customer;
    if (order.customerEmail) orderData.customer_email = order.customerEmail;
    if (order.total) orderData.total = order.total;

    return from(
      this.supabase
        .from('orders')
        .update(orderData)
        .eq('id', id)
        .select('*, order_items(*, products(*))')
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToOrder(response.data);
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supabase
        .from('orders')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  private mapToOrder(data: any): Order {
    return {
      id: data.id,
      customer: data.customer_name,
      customerEmail: data.customer_email,
      total: parseFloat(data.total),
      status: data.status,
      date: data.created_at ? new Date(data.created_at).toLocaleDateString('es-PE') : '',
      userId: data.user_id,
      items: (data.order_items || []).map((item: any) => ({
        productId: item.product_id,
        productName: item.products?.name || '',
        quantity: item.quantity,
        price: parseFloat(item.price),
        subtotal: parseFloat(item.price) * item.quantity,
        colorId: item.product_color_id
      }))
    };
  }

  private mapToOrders(data: any[]): Order[] {
    return data.map(item => this.mapToOrder(item));
  }
}
