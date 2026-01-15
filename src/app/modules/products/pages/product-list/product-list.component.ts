import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { FooterComponent } from '../../../../shared/components/footer/footer.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductSearchComponent } from '../../components/product-search/product-search.component';
import { FilterBarComponent, FilterOptions } from '../../components/filter-bar/filter-bar.component';
import { ProductSortComponent, SortOption } from '../../components/product-sort/product-sort.component';

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
    HeaderComponent,
    FooterComponent,
    ProductCardComponent,
    ProductSearchComponent,
    FilterBarComponent,
    ProductSortComponent
  ],
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export default class ProductListComponent {
  allProducts: Product[] = [
    {
      id: 1,
      name: 'AirPods Pro Ultra 2',
      category: 'Audífonos',
      price: 149,
      originalPrice: 249,
      rating: 4,
      reviews: 125,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Audífonos inalámbricos avanzados diseñados para ofrecer una experiencia de audio excepcional'
    },
    {
      id: 2,
      name: 'Sony WH-1000XM5',
      category: 'Audífonos',
      price: 299,
      originalPrice: 399,
      rating: 5,
      reviews: 89,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Cancelación de ruido líder en la industria con calidad de sonido premium'
    },
    {
      id: 3,
      name: 'Bose QuietComfort 45',
      category: 'Audífonos',
      price: 279,
      originalPrice: 329,
      rating: 4,
      reviews: 156,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Comodidad excepcional con cancelación de ruido activa'
    },
    {
      id: 4,
      name: 'Samsung Galaxy Buds2 Pro',
      category: 'Audífonos',
      price: 199,
      originalPrice: 229,
      rating: 4,
      reviews: 203,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Audífonos true wireless con calidad de audio 360'
    },
    {
      id: 5,
      name: 'JBL Tune 760NC',
      category: 'Audífonos',
      price: 99,
      originalPrice: 149,
      rating: 4,
      reviews: 78,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Sonido JBL Pure Bass con cancelación de ruido'
    },
    {
      id: 6,
      name: 'Casual Shoes',
      category: 'Sports',
      price: 28,
      originalPrice: 40,
      rating: 4,
      reviews: 4,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Zapatos casuales cómodos para uso diario'
    },
    {
      id: 7,
      name: 'Running Shoes',
      category: 'Sports',
      price: 35,
      originalPrice: 50,
      rating: 4,
      reviews: 8,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Zapatos deportivos ideales para correr'
    },
    {
      id: 8,
      name: 'Basketball Shoes',
      category: 'Sports',
      price: 45,
      originalPrice: 60,
      rating: 4,
      reviews: 12,
      image: 'https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/card/productImageWithoutBg.png',
      description: 'Zapatos de baloncesto con máximo agarre'
    },
    {
      id: 9,
      name: 'Xiphone 14 Pro Maxe',
      category: 'Smartphones',
      price: 175,
      originalPrice: 200,
      rating: 4,
      reviews: 121,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
      description: 'Smartphone de última generación con pantalla ProMotion'
    },
    {
      id: 10,
      name: 'Samsonge Galaxy S24',
      category: 'Smartphones',
      price: 299,
      originalPrice: 399,
      rating: 5,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
      description: 'Smartphone premium con cámara avanzada y pantalla AMOLED'
    }
  ];

  filteredProducts: Product[] = [...this.allProducts];
  searchTerm = '';
  currentFilters: FilterOptions = {};
  currentSort: SortOption = 'relevance';
  isFilterModalOpen = false;

  categories = ['Audífonos', 'Sports', 'Smartphones', 'Laptops', 'Tablets'];
  brands = ['Apple', 'Samsung', 'Sony', 'Bose', 'JBL', 'Nike', 'Adidas'];
  
  // Estado temporal para el modal
  tempSelectedCategories: string[] = [];
  tempSelectedBrands: string[] = [];
  tempPriceRange = { min: 0, max: 5000 };

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
