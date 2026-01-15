import { Injectable } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface ProductColor {
  id?: string;
  name: string;
  hex: string;
  images: string[];
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  brand_id: string;
  brand?: string;
  price: number;
  sale_price?: number;
  on_sale?: boolean;
  stock: number;
  weight: string;
  status: string;
  visible: boolean;
  featured?: boolean;
  recommended?: boolean;
  categories?: string[];
  colors?: ProductColor[];
  image?: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private supabase: SupabaseClient = getSupabaseClient();

  getAll(): Observable<Product[]> {
    return from(
      this.supabase
        .from('products')
        .select('*, brands(name)')
        .order('created_at', { ascending: false })
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        const products = response.data || [];
        
        // Obtener colores e imágenes para cada producto
        const productPromises = products.map(product => 
          this.getProductWithDetails(product)
        );
        
        return forkJoin(productPromises);
      })
    );
  }

  getById(id: string): Observable<Product | null> {
    return from(
      this.supabase
        .from('products')
        .select('*, brands(name), product_categories(category_id, categories(*))')
        .eq('id', id)
        .single()
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        if (!response.data) return from([null]);
        return this.getProductWithDetails(response.data).pipe(
          map(product => product)
        );
      })
    );
  }

  create(product: Partial<Product>): Observable<Product> {
    const productData = {
      name: product.name,
      description: product.description,
      brand_id: product.brand_id,
      price: product.price,
      sale_price: product.sale_price || null,
      on_sale: product.on_sale || false,
      stock: product.stock,
      weight: product.weight,
      status: product.status || 'Activo',
      visible: product.visible ?? true,
      featured: product.featured || false,
      recommended: product.recommended || false
    };

    return from(
      this.supabase
        .from('products')
        .insert(productData)
        .select('*, brands(name)')
        .single()
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        const newProduct = response.data;

        // Guardar categorías
        const categoryPromises = (product.categories || []).map(categoryId =>
          this.supabase
            .from('product_categories')
            .insert({ product_id: newProduct.id, category_id: categoryId })
        );

        // Guardar colores con imágenes
        const colorPromises = (product.colors || []).map(color =>
          this.saveProductColor(newProduct.id, color)
        );

        return forkJoin([...categoryPromises, ...colorPromises]).pipe(
          map(() => newProduct)
        );
      }),
      switchMap(productData => this.getProductWithDetails(productData))
    );
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    const productData: any = {};
    if (product.name) productData.name = product.name;
    if (product.description) productData.description = product.description;
    if (product.brand_id) productData.brand_id = product.brand_id;
    if (product.price !== undefined) productData.price = product.price;
    if (product.sale_price !== undefined) productData.sale_price = product.sale_price;
    if (product.on_sale !== undefined) productData.on_sale = product.on_sale;
    if (product.stock !== undefined) productData.stock = product.stock;
    if (product.weight) productData.weight = product.weight;
    if (product.status) productData.status = product.status;
    if (product.visible !== undefined) productData.visible = product.visible;
    if (product.featured !== undefined) productData.featured = product.featured;
    if (product.recommended !== undefined) productData.recommended = product.recommended;

    return from(
      this.supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select('*, brands(name)')
        .single()
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        
        // Actualizar categorías si se proporcionan
        if (product.categories) {
          return this.updateProductCategories(id, product.categories).pipe(
            switchMap(() => from([response.data]))
          );
        }
        
        return from([response.data]);
      }),
      switchMap(productData => this.getProductWithDetails(productData))
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supabase
        .from('products')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  private saveProductColor(productId: string, color: ProductColor): Observable<any> {
    return from(
      this.supabase
        .from('product_colors')
        .insert({
          product_id: productId,
          name: color.name,
          hex: color.hex
        })
        .select()
        .single()
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        const colorId = response.data.id;

        // Guardar imágenes del color
        if (color.images && color.images.length > 0) {
          const imagePromises = color.images.map((imageUrl, index) =>
            this.supabase
              .from('product_color_images')
              .insert({
                product_color_id: colorId,
                image_url: imageUrl,
                order_index: index
              })
          );
          return forkJoin(imagePromises);
        }
        
        return from([null]);
      })
    );
  }

  private updateProductCategories(productId: string, categoryIds: string[]): Observable<void> {
    // Eliminar categorías existentes
    return from(
      this.supabase
        .from('product_categories')
        .delete()
        .eq('product_id', productId)
    ).pipe(
      switchMap(() => {
        // Insertar nuevas categorías
        if (categoryIds.length === 0) return from([null]);
        
        const inserts = categoryIds.map(categoryId =>
          this.supabase
            .from('product_categories')
            .insert({ product_id: productId, category_id: categoryId })
        );
        
        return forkJoin(inserts);
      }),
      map(() => undefined)
    );
  }

  private getProductWithDetails(productData: any): Observable<Product> {
    const productId = productData.id;

    return from(
      this.supabase
        .from('product_colors')
        .select('*, product_color_images(*)')
        .eq('product_id', productId)
    ).pipe(
      switchMap(colorsResponse => {
        const colors: ProductColor[] = (colorsResponse.data || []).map((color: any) => ({
          id: color.id,
          name: color.name,
          hex: color.hex,
          images: (color.product_color_images || [])
            .sort((a: any, b: any) => a.order_index - b.order_index)
            .map((img: any) => img.image_url)
        }));

        return from(
          this.supabase
            .from('product_categories')
            .select('category_id, categories(*)')
            .eq('product_id', productId)
        ).pipe(
          map(categoriesResponse => {
            const categories = (categoriesResponse.data || []).map((pc: any) => pc.category_id);

            return {
              id: productData.id,
              name: productData.name,
              description: productData.description,
              brand_id: productData.brand_id,
              brand: productData.brands?.name,
              price: productData.price,
              sale_price: productData.sale_price,
              on_sale: productData.on_sale,
              stock: productData.stock,
              weight: productData.weight,
              status: productData.status,
              visible: productData.visible,
              featured: productData.featured,
              recommended: productData.recommended,
              categories,
              colors,
              image: colors[0]?.images[0] || null,
              created_at: productData.created_at,
              updated_at: productData.updated_at
            } as Product;
          })
        );
      })
    );
  }
}
