import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductFavoriteComponent } from '../product-favorite/product-favorite.component';
import { CartService } from '../../../../core/services/cart.service';

interface Product {
  id: number | string;
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
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductFavoriteComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  get hasDiscount(): boolean {
    return !!(this.product.onSale && this.product.salePrice);
  }

  get originalPrice(): number {
    if (this.hasDiscount) {
      return this.product.price;
    }
    return this.product.originalPrice || this.product.price;
  }

  get finalPrice(): number {
    if (this.hasDiscount && this.product.salePrice) {
      return this.product.salePrice;
    }
    return this.product.price;
  }

  get discountPercentage(): number {
    if (this.hasDiscount && this.product.salePrice && this.product.price) {
      return Math.round(((this.product.price - this.product.salePrice) / this.product.price) * 100);
    }
    return 0;
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }

  addToCart(): void {
    this.cartService.addItem(
      {
        id: this.product.id,
        name: this.product.name,
        price: this.finalPrice,
        originalPrice: this.originalPrice,
        image: this.product.image
      },
      1
    );
  }
}
