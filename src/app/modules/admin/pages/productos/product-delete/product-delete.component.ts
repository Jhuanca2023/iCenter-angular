import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProductsService } from '../../../../../core/services/products.service';
import { Product } from '../../../../../core/interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './product-delete.component.html',
  styleUrl: './product-delete.component.css'
})
export default class ProductDeleteComponent implements OnInit, OnDestroy {
  productId: string | null = null;
  product: Product | null = null;
  showConfirmModal = true;
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Productos', route: '/admin/productos' },
    { label: 'Eliminar' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductData();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadProductData(): void {
    if (!this.productId) return;

    this.isLoading = true;
    this.error = null;

    this.subscription = this.productsService.getById(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando producto:', err);
        this.error = 'Error al cargar el producto. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.productId) return;

    this.isLoading = true;
    this.error = null;

    this.productsService.delete(this.productId).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        console.error('Error eliminando producto:', err);
        this.error = 'Error al eliminar el producto. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  cancelDelete(): void {
    this.router.navigate(['/admin/productos']);
  }

  get category(): string {
    if (!this.product || !this.product.categories || !Array.isArray(this.product.categories)) {
      return 'N/A';
    }
    return this.product.categories[0] || 'N/A';
  }
}
