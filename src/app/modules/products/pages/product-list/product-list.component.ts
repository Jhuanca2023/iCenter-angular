import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductSearchComponent } from '../../components/product-search/product-search.component';
import { FilterBarComponent, FilterOptions } from '../../components/filter-bar/filter-bar.component';
import { ProductSortComponent, SortOption } from '../../components/product-sort/product-sort.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProductsService } from '../../../../core/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { BrandsService } from '../../../../core/services/brands.service';
import { ClientProduct } from '../../../../core/interfaces/product.interface';
import { Subscription } from 'rxjs';

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
    ProductSortComponent,
    BreadcrumbsComponent
  ],
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.Default
})
export default class ProductListComponent implements OnInit, OnDestroy {
  allProducts: ClientProduct[] = [];
  filteredProducts: ClientProduct[] = [];
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Inicio', route: '/' },
    { label: 'Productos' }
  ];
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
  tempPriceRange = { min: 0, max: 10000 };

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private brandsService: BrandsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadFiltersData();

    // Escuchar cambios en query params
    this.subscription = this.route.queryParams.subscribe(params => {
      const categoryFromUrl = params['categoria'];
      if (categoryFromUrl) {
        // Asumimos que es un ID o Nombre. El servicio searchProducts filtra por nombres.
        // Si queremos filtrar por ID necesitamos ajustar la lógica de applyFilters.
        this.currentFilters.categories = [categoryFromUrl];
      }
      this.loadProducts();
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadFiltersData(): void {
    // Cargar todas las categorías
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories.map(c => c.name).sort();
      },
      error: (err) => console.error('Error cargando categorías para filtros:', err)
    });

    // Cargar todas las marcas
    this.brandsService.getAll().subscribe({
      next: (brands) => {
        this.brands = brands.map(b => b.name).sort();
      },
      error: (err) => console.error('Error cargando marcas para filtros:', err)
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = null;

    this.productsService.searchProducts().subscribe({
      next: (response) => {
        this.allProducts = response.products;
        // Ya no extraemos de los productos, usamos la lista maestra cargada en loadFiltersData
        this.applyFilters(); // Aplicar filtros iniciales (incluyendo los de URL)
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.error = 'Error al cargar los productos. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.applyFilters();
  }

  onFiltersChange(filters: FilterOptions): void {
    this.currentFilters = filters;
    this.applyFilters();
  }

  onFavoriteToggle(event: { productId: number | string; isFavorite: boolean }): void {
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
    this.tempPriceRange = { min: 0, max: 10000 };
    this.applyFilters();
  }

  openFilterModal(): void {
    this.isFilterModalOpen = true;
    this.tempSelectedCategories = [...(this.currentFilters.categories || [])];
    this.tempSelectedBrands = [...(this.currentFilters.brands || [])];
    this.tempPriceRange = {
      min: this.currentFilters.minPrice || 0,
      max: this.currentFilters.maxPrice || 10000
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

    // Aplicar filtros de categoría (soporta ID o nombre)
    if (this.currentFilters.categories && this.currentFilters.categories.length > 0) {
      products = products.filter(p => {
        // Verificar contra nombres
        const matchesName = p.category_names && p.category_names.some(catName => this.currentFilters.categories!.includes(catName));
        // Verificar contra ID (si el servicio lo incluyera en ClientProduct, por ahora usamos category_names)
        return matchesName;
      });
    }

    if (this.currentFilters.minPrice !== undefined) {
      products = products.filter(p => {
        const finalPrice = p.onSale && p.salePrice ? p.salePrice : p.price;
        return finalPrice >= this.currentFilters.minPrice!;
      });
    }

    if (this.currentFilters.maxPrice !== undefined) {
      products = products.filter(p => {
        const finalPrice = p.onSale && p.salePrice ? p.salePrice : p.price;
        return finalPrice <= this.currentFilters.maxPrice!;
      });
    }

    // Aplicar filtros de marca
    if (this.currentFilters.brands && this.currentFilters.brands.length > 0) {
      products = products.filter(p => {
        return p.brand && this.currentFilters.brands!.includes(p.brand);
      });
    }

    // Aplicar ordenamiento
    products = this.sortProducts(products, this.currentSort);

    this.filteredProducts = products;
  }

  private sortProducts(products: ClientProduct[], sort: SortOption): ClientProduct[] {
    const sorted = [...products];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => {
          const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
          const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
          return priceA - priceB;
        });
      case 'price-desc':
        return sorted.sort((a, b) => {
          const priceA = a.onSale && a.salePrice ? a.salePrice : a.price;
          const priceB = b.onSale && b.salePrice ? b.salePrice : b.price;
          return priceB - priceA;
        });
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
