import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export default class AdminCategoriesComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Categorías' }
  ];
  
  searchTerm = '';
  
  categories = [
    { 
      id: 1, 
      name: 'Gaming', 
      description: 'Dispositivos de gaming',
      brand: 'Sony',
      productCount: 8,
      visible: true
    },
    { 
      id: 2, 
      name: 'Laptops', 
      description: 'Computadoras portátiles',
      brand: 'HP',
      productCount: 7,
      visible: true
    },
    { 
      id: 3, 
      name: 'Smartphones', 
      description: 'Teléfonos inteligentes',
      brand: 'Apple',
      productCount: 7,
      visible: true
    },
    { 
      id: 4, 
      name: 'Audio', 
      description: 'Audífonos y altavoces',
      brand: 'Sony',
      productCount: 5,
      visible: true
    },
    { 
      id: 5, 
      name: 'Wearables', 
      description: 'Dispositivos portátiles',
      brand: 'Apple',
      productCount: 5,
      visible: true
    }
  ];

  get filteredCategories() {
    let filtered = [...this.categories];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(term) ||
        (c.description && c.description.toLowerCase().includes(term)) ||
        (c.brand && c.brand.toLowerCase().includes(term))
      );
    }

    return filtered;
  }

  getInitials(name: string): string {
    return name.substring(0, 2).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = [
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  clearFilters(): void {
    this.searchTerm = '';
  }
}
