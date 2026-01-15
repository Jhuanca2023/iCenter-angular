import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export default class AdminCategoriesComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Categorías' }
  ];
  categories = [
    { 
      id: 1, 
      name: 'Gaming', 
      description: 'Dispositivos de gaming', 
      productCount: 8,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=200&h=200&fit=crop'
    },
    { 
      id: 2, 
      name: 'Laptops', 
      description: 'Computadoras portátiles', 
      productCount: 7,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop'
    },
    { 
      id: 3, 
      name: 'Smartphones', 
      description: 'Teléfonos inteligentes', 
      productCount: 7,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop'
    },
    { 
      id: 4, 
      name: 'Audio', 
      description: 'Audífonos y altavoces', 
      productCount: 5,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop'
    },
    { 
      id: 5, 
      name: 'Wearables', 
      description: 'Dispositivos portátiles', 
      productCount: 5,
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40f17ca?w=200&h=200&fit=crop'
    }
  ];
}
