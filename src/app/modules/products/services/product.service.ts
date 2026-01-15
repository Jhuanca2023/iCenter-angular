import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product, ProductListResponse, ProductSearchParams } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'AirPods Pro Ultra 2',
      category: 'Audífonos',
      price: 149,
      originalPrice: 249,
      rating: 4,
      reviews: 125,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Audífonos inalámbricos avanzados diseñados para ofrecer una experiencia de audio excepcional',
      stock: 50,
      brand: 'Apple'
    },
    {
      id: 2,
      name: 'Sony WH-1000XM5',
      category: 'Audífonos',
      price: 299,
      originalPrice: 399,
      rating: 5,
      reviews: 89,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Cancelación de ruido líder en la industria con calidad de sonido premium',
      stock: 30,
      brand: 'Sony'
    },
    {
      id: 3,
      name: 'Bose QuietComfort 45',
      category: 'Audífonos',
      price: 279,
      originalPrice: 329,
      rating: 4,
      reviews: 156,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Comodidad excepcional con cancelación de ruido activa',
      stock: 25,
      brand: 'Bose'
    },
    {
      id: 4,
      name: 'Samsung Galaxy Buds2 Pro',
      category: 'Audífonos',
      price: 199,
      originalPrice: 229,
      rating: 4,
      reviews: 203,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Audífonos true wireless con calidad de audio 360',
      stock: 40,
      brand: 'Samsung'
    },
    {
      id: 5,
      name: 'JBL Tune 760NC',
      category: 'Audífonos',
      price: 99,
      originalPrice: 149,
      rating: 4,
      reviews: 78,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Sonido JBL Pure Bass con cancelación de ruido',
      stock: 60,
      brand: 'JBL'
    },
    {
      id: 6,
      name: 'Casual Shoes',
      category: 'Sports',
      price: 28,
      originalPrice: 40,
      rating: 4,
      reviews: 4,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Zapatos casuales cómodos para uso diario',
      stock: 100,
      brand: 'Nike'
    },
    {
      id: 7,
      name: 'Running Shoes',
      category: 'Sports',
      price: 35,
      originalPrice: 50,
      rating: 4,
      reviews: 8,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Zapatos deportivos ideales para correr',
      stock: 80,
      brand: 'Adidas'
    },
    {
      id: 8,
      name: 'Basketball Shoes',
      category: 'Sports',
      price: 45,
      originalPrice: 60,
      rating: 4,
      reviews: 12,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Zapatos de baloncesto con máximo agarre',
      stock: 45,
      brand: 'Nike'
    },
    {
      id: 9,
      name: 'Xiphone 14 Pro Maxe',
      category: 'Smartphones',
      price: 175,
      originalPrice: 200,
      rating: 4,
      reviews: 121,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      description: 'Smartphone de última generación con pantalla ProMotion',
      stock: 20,
      brand: 'Apple'
    },
    {
      id: 10,
      name: 'Samsonge Galaxy S24',
      category: 'Smartphones',
      price: 299,
      originalPrice: 399,
      rating: 5,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
      description: 'Smartphone premium con cámara avanzada y pantalla AMOLED',
      stock: 35,
      brand: 'Samsung'
    }
  ];

  getProducts(params?: ProductSearchParams): Observable<ProductListResponse> {
    let products = [...this.mockProducts];

    if (params?.query) {
      const term = params.query.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }

    if (params?.filters) {
      const filters = params.filters;
      if (filters.category) {
        products = products.filter(p => p.category === filters.category);
      }
      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.brand) {
        products = products.filter(p => p.brand === filters.brand);
      }
      if (filters.rating !== undefined) {
        products = products.filter(p => p.rating >= filters.rating!);
      }
      if (filters.inStock !== undefined) {
        products = products.filter(p => (p.stock || 0) > 0);
      }
    }

    if (params?.sort) {
      products = this.sortProducts(products, params.sort);
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return of({
      products: paginatedProducts,
      total,
      page,
      limit,
      totalPages
    }).pipe(delay(300));
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product).pipe(delay(200));
  }

  private sortProducts(products: Product[], sort: string): Product[] {
    const sorted = [...products];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }
}
