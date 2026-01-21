import { Injectable } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Category {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  brand_id?: string;
  productCount?: number;
  visible: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private supabase: SupabaseClient = getSupabaseClient();

  getAll(): Observable<Category[]> {
    return from(
      this.supabase
        .from('categories')
        .select('*, brands(name)')
        .order('name', { ascending: true })
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        const rows = response.data || [];

        if (rows.length === 0) {
          return from([[]]);
        }

        const categoryObservables = rows.map((row: any) =>
          this.getProductCountForCategory(row.id).pipe(
            map(count => {
              const category = this.mapToCategory(row);
              category.productCount = count;
              return category;
            })
          )
        );

        return forkJoin(categoryObservables);
      })
    );
  }

  getById(id: string): Observable<Category | null> {
    return from(
      this.supabase
        .from('categories')
        .select('*, brands(*)')
        .eq('id', id)
        .single()
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        if (!response.data) return from([null]);

        return this.getProductCountForCategory(response.data.id).pipe(
          map(count => {
            const category = this.mapToCategory(response.data);
            category.productCount = count;
            return category;
          })
        );
      })
    );
  }

  create(category: Partial<Category>): Observable<Category> {
    if (!category.brand_id) {
      throw new Error('La categoría debe estar asociada a una marca');
    }

    const categoryData = {
      name: category.name,
      description: category.description || null,
      brand_id: category.brand_id,
      visible: category.visible ?? true,
      image_url: category.image_url || null
    };

    return from(
      this.supabase
        .from('categories')
        .insert(categoryData)
        .select('*, brands(*)')
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToCategory(response.data);
      })
    );
  }

  update(id: string, category: Partial<Category>): Observable<Category> {
    const categoryData: any = {};
    if (category.name) categoryData.name = category.name;
    if (category.description !== undefined) categoryData.description = category.description;
    if (category.brand_id) categoryData.brand_id = category.brand_id;
    if (category.visible !== undefined) categoryData.visible = category.visible;
    if (category.image_url !== undefined) categoryData.image_url = category.image_url;

    return from(
      this.supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select('*, brands(*)')
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToCategory(response.data);
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supabase
        .from('categories')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  private mapToCategory(data: any): Category {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      brand: data.brands?.name || data.brand,
      brand_id: data.brand_id,
      productCount: data.product_count || 0,
      visible: data.visible,
      image_url: data.image_url,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  private mapToCategories(data: any[]): Category[] {
    return data.map(item => this.mapToCategory(item));
  }

  private getProductCountForCategory(categoryId: string): Observable<number> {
    return from(
      this.supabase
        .from('product_categories')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.count || 0;
      })
    );
  }
}
