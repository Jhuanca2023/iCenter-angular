import { Injectable } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface ProductSearchParams {
  query?: string;
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    rating?: number;
    inStock?: boolean;
  };
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating';
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  products: ClientProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientProduct {
  id: number | string; // Permitir string (UUID) o number
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  salePrice?: number;
  onSale?: boolean;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
  stock?: number;
  brand?: string;
}

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
        .eq('visible', true)
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
        .eq('visible', true)
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
        
        const updatePromises: Observable<any>[] = [];
        
        // Actualizar categorías si se proporcionan
        if (product.categories) {
          updatePromises.push(this.updateProductCategories(id, product.categories));
        }
        
        // Actualizar colores si se proporcionan
        if (product.colors !== undefined) {
          updatePromises.push(this.updateProductColors(id, product.colors));
        }
        
        if (updatePromises.length > 0) {
          return forkJoin(updatePromises).pipe(
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

  getByBrandId(brandId: string): Observable<Product[]> {
    return from(
      this.supabase
        .from('products')
        .select('*, brands(name)')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false })
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        const products = response.data || [];
        
        if (products.length === 0) {
          return from([[]]);
        }
        
        const productPromises = products.map(product => 
          this.getProductWithDetails(product)
        );
        
        return forkJoin(productPromises);
      })
    );
  }

  getByCategoryId(categoryId: string): Observable<Product[]> {
    return from(
      this.supabase
        .from('product_categories')
        .select('product_id, products(*, brands(name))')
        .eq('category_id', categoryId)
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        const productCategories = response.data || [];
        
        if (productCategories.length === 0) {
          return from([[]]);
        }
        
        const products = productCategories.map((pc: any) => pc.products).filter(Boolean);
        
        const productPromises = products.map((product: any) => 
          this.getProductWithDetails(product)
        );
        
        return forkJoin(productPromises);
      })
    );
  }

  searchProducts(params?: ProductSearchParams): Observable<ProductListResponse> {
    return this.getAll().pipe(
      map(products => {
        let filtered = [...products];

        if (params?.query) {
          const term = params.query.toLowerCase();
          filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(term) ||
            (p.description && p.description.toLowerCase().includes(term)) ||
            (Array.isArray(p.categories) && p.categories.some((cat: string) => cat.toLowerCase().includes(term)))
          );
        }

        if (params?.filters) {
          const filters = params.filters;
          if (filters.category) {
            filtered = filtered.filter(p => 
              Array.isArray(p.categories) && p.categories.includes(filters.category!)
            );
          }
          if (filters.minPrice !== undefined) {
            filtered = filtered.filter(p => p.price >= filters.minPrice!);
          }
          if (filters.maxPrice !== undefined) {
            filtered = filtered.filter(p => p.price <= filters.maxPrice!);
          }
          if (filters.brand) {
            filtered = filtered.filter(p => p.brand === filters.brand);
          }
          if (filters.inStock !== undefined) {
            filtered = filtered.filter(p => (p.stock || 0) > 0);
          }
        }

        if (params?.sort) {
          filtered = this.sortProducts(filtered, params.sort);
        }

        const page = params?.page || 1;
        const limit = params?.limit || 10;
        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

        return {
          products: this.mapToClientProducts(paginatedProducts),
          total,
          page,
          limit,
          totalPages
        };
      })
    );
  }

  getProductByIdForClient(id: number | string): Observable<ClientProduct | undefined> {
    return this.getById(String(id)).pipe(
      map(product => product ? this.mapToClientProduct(product) : undefined)
    );
  }

  private mapToClientProducts(products: Product[]): ClientProduct[] {
    return products
      .map(p => this.mapToClientProduct(p))
      .filter(p => p !== null); // Filtrar productos no visibles
  }

  private mapToClientProduct(product: Product): ClientProduct {
    // Solo mostrar productos visibles
    if (!product.visible) {
      return null as any;
    }
    
    // Mantener el ID como string si es UUID, convertir a número solo si es numérico
    const productId = typeof product.id === 'string' ? product.id : (Number(product.id) || 0);
    
    return {
      id: productId as any, // Permitir string o number para compatibilidad
      name: product.name,
      category: Array.isArray(product.categories) && product.categories.length > 0 
        ? product.categories[0] 
        : 'Sin categoría',
      price: product.price, // Precio original/regular
      originalPrice: product.on_sale && product.sale_price ? product.price : undefined,
      salePrice: product.on_sale && product.sale_price ? product.sale_price : undefined,
      onSale: product.on_sale || false,
      rating: 4,
      reviews: 0,
      image: product.image || (product.colors && product.colors[0]?.images?.[0]) || '',
      description: product.description,
      stock: product.stock || 0,
      brand: product.brand || ''
    };
  }

  private sortProducts(products: Product[], sort: string): Product[] {
    const sorted = [...products];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = a.on_sale && a.sale_price ? a.sale_price : a.price;
          const priceB = b.on_sale && b.sale_price ? b.sale_price : b.price;
          return priceA - priceB;
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = a.on_sale && a.sale_price ? a.sale_price : a.price;
          const priceB = b.on_sale && b.sale_price ? b.sale_price : b.price;
          return priceB - priceA;
        });
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'rating':
        return sorted;
      default:
        return sorted;
    }
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

  private updateProductColors(productId: string, colors: ProductColor[]): Observable<void> {
    // Eliminar colores existentes y sus imágenes
    return from(
      this.supabase
        .from('product_colors')
        .delete()
        .eq('product_id', productId)
    ).pipe(
      switchMap(() => {
        // Insertar nuevos colores
        if (colors.length === 0) return from([null]);
        
        const colorPromises = colors.map(color =>
          this.saveProductColor(productId, color)
        );
        
        return forkJoin(colorPromises);
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
            .select('category_id, categories(name)')
            .eq('product_id', productId)
        ).pipe(
          map(categoriesResponse => {
            // Mapear categorías: usar nombres si están disponibles, sino usar IDs
            const categories = (categoriesResponse.data || []).map((pc: any) => 
              pc.categories?.name || pc.category_id
            );

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
              categories: Array.isArray(categories) ? categories as string[] : [],
              colors,
              image: colors[0]?.images[0] || productData.image || null,
              created_at: productData.created_at,
              updated_at: productData.updated_at
            } as Product;
          })
        );
      })
    );
  }
}
