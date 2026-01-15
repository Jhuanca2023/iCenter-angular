import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductFavoriteComponent } from '../product-favorite/product-favorite.component';

interface Product {
  id: number;
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

  getStarsArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }

  get hasDiscount(): boolean {
    // Si tiene onSale y salePrice, hay descuento
    return !!(this.product.onSale && this.product.salePrice);
  }

  get originalPrice(): number {
    // Si tiene descuento, el precio original es price (precio regular)
    // Si no tiene descuento pero tiene originalPrice, usarlo
    if (this.hasDiscount) {
      return this.product.price; // price es el precio regular
    }
    return this.product.originalPrice || this.product.price;
  }

  get finalPrice(): number {
    // Si tiene descuento, el precio final es salePrice
    // Si no tiene descuento, el precio final es price
    if (this.hasDiscount && this.product.salePrice) {
      return this.product.salePrice;
    }
    return this.product.price;
  }

  get discountPercentage(): number {
    // Calcular descuento: ((precio_regular - precio_descuento) / precio_regular) * 100
    // price es el precio regular, salePrice es el precio con descuento
    if (this.hasDiscount && this.product.salePrice && this.product.price) {
      return Math.round(((this.product.price - this.product.salePrice) / this.product.price) * 100);
    }
    return 0;
  }
}
