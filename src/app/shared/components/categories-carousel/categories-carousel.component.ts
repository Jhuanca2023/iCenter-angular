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
    { id: 1, name: 'Computer & Laptop', icon: 'laptop' },
    { id: 2, name: 'Mobile & Phone', icon: 'phone' },
    { id: 3, name: 'Camera', icon: 'camera' },
    { id: 4, name: 'TV & Smart Box', icon: 'tv' },
    { id: 5, name: 'Home Appliance', icon: 'appliance' },
    { id: 6, name: 'Accessories', icon: 'speaker' },
    { id: 7, name: 'Other Categories', icon: 'gamepad' },
    { id: 8, name: 'Gaming', icon: 'gaming' },
    { id: 9, name: 'Audio', icon: 'audio' },
    { id: 10, name: 'Smart Home', icon: 'smart-home' },
    { id: 11, name: 'Wearables', icon: 'wearables' },
    { id: 12, name: 'Tablets', icon: 'tablet' }
  ];
}
