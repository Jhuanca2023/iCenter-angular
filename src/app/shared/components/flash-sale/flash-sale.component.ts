import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../../modules/products/components/product-card/product-card.component';

@Component({
  selector: 'app-flash-sale',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './flash-sale.component.html',
  styleUrl: './flash-sale.component.css',
  encapsulation: ViewEncapsulation.None
})
export class FlashSaleComponent {
  products = [
    {
      id: 1,
      name: 'Xpad Mini 6',
      currentPrice: 89.000,
      originalPrice: 150.00,
      discount: 8,
      description: 'Lorem ipsum dolor sit amet consectetur. Eleifend nec morbi tellus vitae leo nunc.',
      rating: 5,
      reviews: 125,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Hypermac Air Purpler M1',
      currentPrice: 89.000,
      originalPrice: 250.00,
      discount: 8,
      description: 'Lorem ipsum dolor sit amet consectetur. Eleifend nec morbi tellus vitae leo nunc.',
      rating: 5,
      reviews: 125,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'AR10 AC 1PK with S-Inverter',
      currentPrice: 90.000,
      originalPrice: 250.00,
      discount: 13,
      description: 'Lorem ipsum dolor sit amet consectetur. Eleifend nec morbi tellus vitae leo nunc.',
      rating: 5,
      reviews: 125,
      image: 'https://images.unsplash.com/photo-1631543915506-401a73d1a0e8?w=300&h=300&fit=crop'
    }
  ];
}
