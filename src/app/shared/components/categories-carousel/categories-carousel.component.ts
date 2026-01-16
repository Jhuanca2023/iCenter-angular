import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoriesService } from '../../../core/services/categories.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-categories-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-carousel.component.html',
  styleUrl: './categories-carousel.component.css',
  encapsulation: ViewEncapsulation.None
})
export class CategoriesCarouselComponent implements OnInit, OnDestroy {
  categories: Array<{ id: string; name: string; icon: string; image: string }> = [];
  isLoading = false;
  private subscription?: Subscription;

  private iconMap: { [key: string]: string } = {
    'Gaming': 'gaming',
    'Laptops': 'laptop',
    'Smartphones': 'phone',
    'Audio': 'audio',
    'Wearables': 'wearables',
    'Cámaras': 'camera',
    'TV & Smart Box': 'tv',
    'Tablets': 'tablet',
    'Computer & Laptop': 'laptop',
    'Mobile & Phone': 'phone',
    'Camera Imaging': 'camera'
  };

  private defaultImage = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop';

  constructor(private categoriesService: CategoriesService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadCategories(): void {
    this.isLoading = true;
    
    this.subscription = this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories
          .filter(cat => cat.visible)
          .slice(0, 8)
          .map(cat => ({
            id: cat.id,
            name: cat.name,
            icon: this.iconMap[cat.name] || 'default',
            image: cat.image_url || this.defaultImage
          }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.isLoading = false;
      }
    });
  }
}
