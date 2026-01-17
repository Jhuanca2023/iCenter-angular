import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProductsService, Product } from '../../../../core/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BreadcrumbsComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export default class AdminProductosComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Productos' }
  ];
  
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  
  products: Product[] = [];
  categories: string[] = ['Todas las categorías'];
  statuses = ['Todos los estados', 'Activo', 'Inactivo', 'Borrador'];
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = null;
    
    this.subscription = this.productsService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.error = 'Error al cargar los productos. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        const uniqueCategories = new Set<string>();
        categories.forEach(cat => {
          if (cat.name) uniqueCategories.add(cat.name);
        });
        this.categories = ['Todas las categorías', ...Array.from(uniqueCategories).sort()];
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  get filteredProducts() {
    let filtered = [...this.products];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(term) ||
        (Array.isArray(p.categories) && p.categories.some((cat: string) => cat.toLowerCase().includes(term)))
      );
    }

    if (this.selectedCategory && this.selectedCategory !== 'Todas las categorías') {
      filtered = filtered.filter(p => 
        p.categories && p.categories.includes(this.selectedCategory)
      );
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

  getCategory(product: Product): string {
    if (!product.categories || !Array.isArray(product.categories)) {
      return 'N/A';
    }
    return product.categories[0] || 'N/A';
  }

  hasBrands(): boolean {
    return this.products.some(p => p.brand && p.brand.trim() !== '');
  }
}
