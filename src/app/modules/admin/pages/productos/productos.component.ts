import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export default class AdminProductosComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Productos' }
  ];
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';

  categories = ['Todas las categorías', 'Audio', 'Cámaras', 'Smartphones', 'Laptops', 'Gaming', 'Wearables'];
  statuses = ['Todos los estados', 'Activo', 'Inactivo', 'Borrador'];

  products = [
    { 
      id: 1, 
      name: 'AUDÍFONOS BLUETOOTH PARA CASCO MOTO AURICULARES INALÁMBRICOS', 
      category: 'Audio',
      brand: 'Sony',
      price: 89.99, 
      stock: 15,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'
    },
    { 
      id: 2, 
      name: 'CÁMARA RYAN WIFI 4K UHD 3840 X 2160 VIDEO DEPORTIVA ACUATICO ACCIÓN NEGRO', 
      category: 'Cámaras',
      brand: 'Canon',
      price: 199.99, 
      stock: 8,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop'
    },
    { 
      id: 3, 
      name: 'CELULAR SAMSUNG GALAXY S24 ULTRA 256GB 12GB RAM 200MP 6.8 GRIS', 
      category: 'Smartphones',
      brand: 'Samsung',
      price: 999.99, 
      stock: 12,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=100&h=100&fit=crop'
    },
    { 
      id: 4, 
      name: 'LAPTOP ASUS TUF GAMING F15 FX507ZC4-HN005W INTEL CORE I5-12500H 8GB RAM 512 GB SSD 15.6 12 NUCLEOS RTX3050 FHD', 
      category: 'Laptops',
      brand: 'Asus',
      price: 1299.99, 
      stock: 5,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop'
    },
    { 
      id: 5, 
      name: 'SMARTPHONE APPLE IPHONE 15 PRO MAX 256GB TITANIO NATURAL', 
      category: 'Smartphones',
      brand: 'Apple',
      price: 1199.99, 
      stock: 10,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100&h=100&fit=crop'
    },
    { 
      id: 6, 
      name: 'AUDÍFONOS SONY WH-1000XM5 CANCELACIÓN DE RUIDO', 
      category: 'Audio',
      brand: 'Sony',
      price: 349.99, 
      stock: 20,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=100&h=100&fit=crop'
    },
    { 
      id: 7, 
      name: 'LAPTOP MACBOOK PRO 14 M3 PRO 512GB SSD', 
      category: 'Laptops',
      brand: 'Apple',
      price: 1999.99, 
      stock: 6,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop'
    },
    { 
      id: 8, 
      name: 'SMARTWATCH APPLE WATCH SERIES 9 GPS 45MM', 
      category: 'Wearables',
      brand: 'Apple',
      price: 429.99, 
      stock: 18,
      status: 'Activo',
      image: 'https://images.unsplash.com/photo-1579586337278-3befd40f17ca?w=100&h=100&fit=crop'
    }
  ];

  get filteredProducts() {
    let filtered = [...this.products];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }

    if (this.selectedCategory && this.selectedCategory !== 'Todas las categorías') {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    if (this.selectedStatus && this.selectedStatus !== 'Todos los estados') {
      filtered = filtered.filter(p => p.status === this.selectedStatus);
    }

    return filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
  }
}
