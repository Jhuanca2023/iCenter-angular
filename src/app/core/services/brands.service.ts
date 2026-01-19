import { Injectable } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Marca } from '../../modules/admin/interfaces/marca.interface';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {
  private supabase: SupabaseClient = getSupabaseClient();

  getAll(): Observable<Marca[]> {
    return from(
      this.supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true })
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        const brands = response.data || [];
        
        if (brands.length === 0) {
          return from([[]]);
        }
        
        const brandObservables = brands.map((brand: any) => 
          forkJoin({
            categories: from(
              this.supabase
                .from('categories')
                .select('name')
                .eq('brand_id', brand.id)
            ).pipe(
              map(catResponse => catResponse.data?.map((cat: any) => cat.name) || [])
            ),
            productCount: this.getProductCountForBrand(brand.id)
          }).pipe(
            map(result => {
              const marca = this.mapToMarcaWithCategories(brand, result.categories);
              marca.productCount = result.productCount;
              return marca;
            })
          )
        );
        
        return forkJoin(brandObservables);
      })
    );
  }

  getById(id: string): Observable<Marca | null> {
    return from(
      this.supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        if (!response.data) return from([null]);
        
        return forkJoin({
          categories: from(
            this.supabase
              .from('categories')
              .select('id, name')
              .eq('brand_id', id)
          ).pipe(
            map(catResponse => catResponse.data?.map((cat: any) => cat.name) || [])
          ),
          productCount: this.getProductCountForBrand(id)
        }).pipe(
          map(result => {
            const marca = this.mapToMarcaWithCategories(response.data, result.categories);
            marca.productCount = result.productCount;
            return marca;
          })
        );
      })
    );
  }

  create(brand: Partial<Marca>): Observable<Marca> {
    const brandData = {
      name: brand.name,
      description: brand.description || null,
      visible: brand.visible ?? true
    };

    return from(
      this.supabase
        .from('brands')
        .insert(brandData)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToMarca(response.data);
      })
    );
  }

  update(id: string, brand: Partial<Marca>): Observable<Marca> {
    const brandData: any = {};
    if (brand.name) brandData.name = brand.name;
    if (brand.description !== undefined) brandData.description = brand.description;
    if (brand.visible !== undefined) brandData.visible = brand.visible;

    return from(
      this.supabase
        .from('brands')
        .update(brandData)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToMarca(response.data);
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supabase
        .from('brands')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  private mapToMarca(data: any): Marca {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      visible: data.visible,
      categories: data.brand_categories?.map((bc: any) => bc.categories?.name).filter(Boolean) || [],
      productCount: data.product_count || 0,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
    };
  }

  private mapToMarcaWithCategories(data: any, categories: string[]): Marca {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      visible: data.visible,
      categories: categories,
      productCount: data.product_count || 0,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
    };
  }

  private mapToMarcas(data: any[]): Marca[] {
    return data.map(item => this.mapToMarca(item));
  }

  private getProductCountForBrand(brandId: string): Observable<number> {
    return from(
      this.supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brandId)
        .eq('visible', true)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.count || 0;
      })
    );
  }
}
