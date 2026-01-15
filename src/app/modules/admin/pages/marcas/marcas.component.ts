import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { Marca } from '../../interfaces/marca.interface';

@Component({
  selector: 'app-admin-marcas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './marcas.component.html',
  styleUrl: './marcas.component.css'
})
export default class AdminMarcasComponent {
  searchTerm = '';
  selectedCategory = '';

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Marcas' }
  ];

  categories = ['Todas las categorías', 'Laptops', 'Audio', 'Cámaras', 'Gaming', 'Smartphones', 'Wearables'];

  brands: Marca[] = [
    { 
      id: 1, 
      name: 'Apple', 
      categories: ['Smartphones', 'Laptops', 'Wearables'],
      productCount: 12,
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 2, 
      name: 'Samsung', 
      categories: ['Smartphones', 'Televisores', 'Audio'],
      productCount: 15,
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 3, 
      name: 'Sony', 
      categories: ['Audio', 'Cámaras', 'Gaming'],
      productCount: 8,
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 4, 
      name: 'HP', 
      categories: ['Laptops', 'Impresoras'],
      productCount: 10,
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 5, 
      name: 'Lenovo', 
      categories: ['Laptops', 'Gaming'],
      productCount: 7,
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 6, 
      name: 'Dell', 
      categories: ['Laptops', 'Gaming'],
      productCount: 9,
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

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

  get filteredBrands() {
    let filtered = [...this.brands];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(term) ||
        (b.description && b.description.toLowerCase().includes(term)) ||
        b.categories.some(cat => cat.toLowerCase().includes(term))
      );
    }

    if (this.selectedCategory && this.selectedCategory !== 'Todas las categorías') {
      filtered = filtered.filter(b => b.categories.includes(this.selectedCategory));
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
  }
}
