import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { BrandsService } from '../../../../core/services/brands.service';
import { Marca } from '../../../../core/interfaces/marca.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-marcas',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BreadcrumbsComponent, PaginationComponent],
  templateUrl: './marcas.component.html',
  styleUrl: './marcas.component.css'
})
export default class AdminMarcasComponent implements OnInit, OnDestroy {
  searchTerm = '';
  selectedCategory = '';
  currentPage = 1;
  itemsPerPage = 10;
  brands: Marca[] = [];
  categories: string[] = ['Todas las categorías'];
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Marcas' }
  ];

  constructor(private brandsService: BrandsService) { }

  ngOnInit(): void {
    this.loadBrands();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadBrands(): void {
    this.isLoading = true;
    this.error = null;

    this.subscription = this.brandsService.getAll().subscribe({
      next: (brands) => {
        this.brands = brands;
        this.extractCategories();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando marcas:', err);
        this.error = 'Error al cargar las marcas. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  private extractCategories(): void {
    const allCategories = new Set<string>();
    this.brands.forEach(brand => {
      brand.categories.forEach(cat => allCategories.add(cat));
    });
    this.categories = ['Todas las categorías', ...Array.from(allCategories).sort()];
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

  get paginatedBrands() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredBrands.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBrands.length / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.currentPage = 1;
  }
}
