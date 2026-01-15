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
      description: 'Marca líder en tecnología',
      categories: ['Smartphones', 'Laptops', 'Wearables'],
      productCount: 12,
      logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=100&h=100&fit=crop',
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 2, 
      name: 'Samsung', 
      description: 'Innovación tecnológica coreana',
      categories: ['Smartphones', 'Televisores', 'Audio'],
      productCount: 15,
      logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=100&h=100&fit=crop',
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 3, 
      name: 'Sony', 
      description: 'Calidad premium en audio y tecnología',
      categories: ['Audio', 'Cámaras', 'Gaming'],
      productCount: 8,
      logo: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=100&h=100&fit=crop',
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 4, 
      name: 'HP', 
      description: 'Soluciones empresariales y personales',
      categories: ['Laptops', 'Impresoras'],
      productCount: 10,
      logo: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 5, 
      name: 'Lenovo', 
      description: 'Computadoras y dispositivos inteligentes',
      categories: ['Laptops', 'Gaming'],
      productCount: 7,
      logo: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    { 
      id: 6, 
      name: 'Dell', 
      description: 'Tecnología confiable para todos',
      categories: ['Laptops', 'Gaming'],
      productCount: 9,
      logo: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop',
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  get filteredBrands() {
    let filtered = [...this.brands];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(term) ||
        b.description.toLowerCase().includes(term) ||
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
