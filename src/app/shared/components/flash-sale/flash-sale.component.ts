import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../../modules/products/components/product-card/product-card.component';
import { ProductsService, Product, ClientProduct } from '../../../core/services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-flash-sale',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './flash-sale.component.html',
  styleUrl: './flash-sale.component.css',
  encapsulation: ViewEncapsulation.None
})
export class FlashSaleComponent implements OnInit, OnDestroy {
  products: ClientProduct[] = [];
  isLoading = false;
  private subscription?: Subscription;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.isLoading = true;
    
    this.subscription = this.productsService.getAll().subscribe({
      next: (products) => {
        this.products = products
          .filter(p => p.on_sale && p.visible && p.stock > 0)
          .slice(0, 3)
          .map(p => {
            const clientProduct = this.mapToClientProduct(p);
            return {
              ...clientProduct,
              discount: p.sale_price && p.price 
                ? Math.round(((p.price - p.sale_price) / p.price) * 100) 
                : 0
            };
          });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando productos en oferta:', err);
        this.isLoading = false;
      }
    });
  }

  private mapToClientProduct(product: Product): ClientProduct {
    // Mantener el ID como string si es UUID, convertir a número solo si es numérico
    const productId = typeof product.id === 'string' ? product.id : (Number(product.id) || 0);
    
    return {
      id: productId as any, // Permitir string o number para compatibilidad
      name: product.name,
      category: Array.isArray(product.categories) && product.categories.length > 0 
        ? product.categories[0] 
        : 'Sin categoría',
      price: product.price, // Precio original
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
}
