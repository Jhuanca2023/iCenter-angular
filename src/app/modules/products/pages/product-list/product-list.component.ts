import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductSearchComponent } from '../../components/product-search/product-search.component';
import { FilterBarComponent, FilterOptions } from '../../components/filter-bar/filter-bar.component';
import { ProductSortComponent, SortOption } from '../../components/product-sort/product-sort.component';
import { ProductsService } from '../../../../core/services/products.service';
import { Subscription } from 'rxjs';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProductCardComponent,
    ProductSearchComponent,
    FilterBarComponent,
    ProductSortComponent
  ],
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export default class ProductListComponent implements OnInit, OnDestroy {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;
  searchTerm = '';
  currentFilters: FilterOptions = {};
  currentSort: SortOption = 'relevance';
  isFilterModalOpen = false;

  categories: string[] = [];
  brands: string[] = [];
  
  // Estado temporal para el modal
  tempSelectedCategories: string[] = [];
  tempSelectedBrands: string[] = [];
  tempPriceRange = { min: 0, max: 5000 };

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = null;
    
    this.subscription = this.productsService.searchProducts().subscribe({
      next: (response) => {
        this.allProducts = response.products;
        this.filteredProducts = [...this.allProducts];
        this.extractCategoriesAndBrands();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.error = 'Error al cargar los productos. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  private extractCategoriesAndBrands(): void {
    const uniqueCategories = new Set<string>();
    const uniqueBrands = new Set<string>();
    
    this.allProducts.forEach(product => {
      if (product.category) uniqueCategories.add(product.category);
      if ((product as any).brand) uniqueBrands.add((product as any).brand);
    });
    
    this.categories = Array.from(uniqueCategories).sort();
    this.brands = Array.from(uniqueBrands).sort();
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onFiltersChange(filters: FilterOptions): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  onFavoriteToggle(event: { productId: number; isFavorite: boolean }): void {
    // TODO: Implementar lógica de favoritos cuando conectemos backend
    console.log('Favorite toggled:', event);
  }

  onSortChange(sort: SortOption): void {
    this.currentSort = sort;
    this.applyFilters();
  }

  onClearFilters(): void {
    this.currentFilters = {};
    this.tempSelectedCategories = [];
    this.tempSelectedBrands = [];
    this.tempPriceRange = { min: 0, max: 5000 };
    this.applyFilters();
  }

  openFilterModal(): void {
    this.isFilterModalOpen = true;
    // Sincronizar estado temporal con filtros actuales
    this.tempSelectedCategories = [...(this.currentFilters.categories || [])];
    this.tempSelectedBrands = [...(this.currentFilters.brands || [])];
    this.tempPriceRange = {
      min: this.currentFilters.minPrice || 0,
      max: this.currentFilters.maxPrice || 5000
    };
  }

  closeFilterModal(): void {
    this.isFilterModalOpen = false;
  }

  toggleCategory(category: string): void {
    const index = this.tempSelectedCategories.indexOf(category);
    if (index > -1) {
      this.tempSelectedCategories.splice(index, 1);
    } else {
      this.tempSelectedCategories.push(category);
    }
  }

  toggleBrand(brand: string): void {
    const index = this.tempSelectedBrands.indexOf(brand);
    if (index > -1) {
      this.tempSelectedBrands.splice(index, 1);
    } else {
      this.tempSelectedBrands.push(brand);
    }
  }

  isCategorySelected(category: string): boolean {
    return this.tempSelectedCategories.includes(category);
  }

  isBrandSelected(brand: string): boolean {
    return this.tempSelectedBrands.includes(brand);
  }

  applyFiltersFromModal(): void {
    this.currentFilters = {
      categories: this.tempSelectedCategories.length > 0 ? this.tempSelectedCategories : undefined,
      brands: this.tempSelectedBrands.length > 0 ? this.tempSelectedBrands : undefined,
      minPrice: this.tempPriceRange.min,
      maxPrice: this.tempPriceRange.max
    };
    this.applyFilters();
    this.closeFilterModal();
  }

  private applyFilters(): void {
    let products = [...this.allProducts];

    // Aplicar búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }

    // Aplicar filtros
    if (this.currentFilters.categories && this.currentFilters.categories.length > 0) {
      products = products.filter(p => this.currentFilters.categories!.includes(p.category));
    }

    if (this.currentFilters.minPrice !== undefined) {
      products = products.filter(p => p.price >= this.currentFilters.minPrice!);
    }

    if (this.currentFilters.maxPrice !== undefined) {
      products = products.filter(p => p.price <= this.currentFilters.maxPrice!);
    }

    // Aplicar ordenamiento
    products = this.sortProducts(products, this.currentSort);

    this.filteredProducts = products;
  }

  private sortProducts(products: Product[], sort: SortOption): Product[] {
    const sorted = [...products];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }
}
