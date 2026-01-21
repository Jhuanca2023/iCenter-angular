import { Injectable } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ProductRatingSummary {
  productId: string;
  average: number;
  count: number;
  userRating?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductReviewsService {
  private supabase: SupabaseClient = getSupabaseClient();

  getRating(productId: string, userId?: string): Observable<ProductRatingSummary> {
    return from(
      this.supabase
        .from('product_reviews')
        .select('rating, user_id')
        .eq('product_id', productId)
    ).pipe(
      map(response => {
        if (response.error) {
          throw response.error;
        }
        const rows = response.data || [];
        if (rows.length === 0) {
          return {
            productId,
            average: 0,
            count: 0,
            userRating: undefined
          };
        }
        const count = rows.length;
        const total = rows.reduce((sum: number, row: any) => sum + (row.rating || 0), 0);
        const average = total / count;
        const userRating = userId
          ? rows.find((row: any) => row.user_id === userId)?.rating || undefined
          : undefined;

        return {
          productId,
          average: Number(average.toFixed(1)),
          count,
          userRating
        };
      })
    );
  }

  setRating(productId: string, userId: string, rating: number): Observable<void> {
    const data = {
      product_id: productId,
      user_id: userId,
      rating
    };

    return from(
      this.supabase
        .from('product_reviews')
        .upsert(data, { onConflict: 'product_id,user_id' })
    ).pipe(
      map(response => {
        if (response.error) {
          throw response.error;
        }
        return;
      })
    );
  }
}

