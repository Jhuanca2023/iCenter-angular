import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOptions {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.css',
  encapsulation: ViewEncapsulation.None
})
export class FilterBarComponent {
  @Input() categories: string[] = [];
  @Input() minPrice = 0;
  @Input() maxPrice = 5000;
  @Output() filtersChange = new EventEmitter<FilterOptions>();
  @Output() clearFilters = new EventEmitter<void>();

  selectedCategories: string[] = [];
  selectedBrands: string[] = [];
  priceRange = { min: 0, max: 5000 };
  brands = ['Apple', 'Samsung', 'Sony', 'Bose', 'JBL', 'Nike', 'Adidas'];

  ngOnInit(): void {
    this.priceRange = { min: this.minPrice, max: this.maxPrice };
  }

  toggleCategory(category: string): void {
    const index = this.selectedCategories.indexOf(category);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
    this.applyFilters();
  }

  toggleBrand(brand: string): void {
    const index = this.selectedBrands.indexOf(brand);
    if (index > -1) {
      this.selectedBrands.splice(index, 1);
    } else {
      this.selectedBrands.push(brand);
    }
    this.applyFilters();
  }

  isCategorySelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }

  isBrandSelected(brand: string): boolean {
    return this.selectedBrands.includes(brand);
  }

  onPriceChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const filters: FilterOptions = {
      categories: this.selectedCategories.length > 0 ? this.selectedCategories : undefined,
      brands: this.selectedBrands.length > 0 ? this.selectedBrands : undefined,
      minPrice: this.priceRange.min,
      maxPrice: this.priceRange.max
    };
    this.filtersChange.emit(filters);
  }

  onClear(): void {
    this.selectedCategories = [];
    this.selectedBrands = [];
    this.priceRange = { min: this.minPrice, max: this.maxPrice };
    this.clearFilters.emit();
  }
}
