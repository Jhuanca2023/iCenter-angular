import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { ProductsService, Product } from '../../../../../core/services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export default class CategoryDetailComponent implements OnInit, OnDestroy {
  categoryId: string | null = null;
  category: any = null;
  products: Product[] = [];
  isLoading = false;
  isLoadingProducts = false;
  error: string | null = null;
  private subscription?: Subscription;
  private productsSubscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Categorías', route: '/admin/categories' },
    { label: 'Detalle' }
  ];

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.loadCategoryData();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  loadCategoryData(): void {
    if (!this.categoryId) return;
    
    this.isLoading = true;
    this.subscription = this.categoriesService.getById(this.categoryId).subscribe({
      next: (category) => {
        if (category) {
          this.category = category;
          this.loadProducts();
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando categoría:', err);
        this.error = 'Error al cargar la categoría.';
        this.isLoading = false;
      }
    });
  }

  loadProducts(): void {
    if (!this.categoryId) return;
    
    this.isLoadingProducts = true;
    this.productsSubscription = this.productsService.getByCategoryId(this.categoryId).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.isLoadingProducts = false;
      }
    });
  }
}
