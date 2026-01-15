import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-categories-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-carousel.component.html',
  styleUrl: './categories-carousel.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CategoriesCarouselComponent {
  categories = [
    { id: 1, name: 'Gaming', icon: 'gaming', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop' },
    { id: 2, name: 'Laptops', icon: 'laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop' },
    { id: 3, name: 'Smartphones', icon: 'phone', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop' },
    { id: 4, name: 'Audio', icon: 'audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop' },
    { id: 5, name: 'Wearables', icon: 'wearables', image: 'https://images.unsplash.com/photo-1579586337278-3befd40f17ca?w=200&h=200&fit=crop' },
    { id: 6, name: 'Cámaras', icon: 'camera', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&h=200&fit=crop' },
    { id: 7, name: 'TV & Smart Box', icon: 'tv', image: 'https://images.unsplash.com/photo-1593359677879-a4b92a0a07d1?w=200&h=200&fit=crop' },
    { id: 8, name: 'Tablets', icon: 'tablet', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop' }
  ];
}
