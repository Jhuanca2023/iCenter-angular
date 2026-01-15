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
}
