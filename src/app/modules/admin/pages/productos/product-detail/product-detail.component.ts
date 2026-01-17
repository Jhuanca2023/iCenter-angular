import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProductsService, Product, ProductColor } from '../../../../../core/services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export default class ProductDetailComponent implements OnInit, OnDestroy {
  productId: string | null = null;
  product: Product | null = null;
  colors: ProductColor[] = [];
  selectedColor: ProductColor | null = null;
  selectedImage: string = '';
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Productos', route: '/admin/productos' },
    { label: 'Detalle' }
  ];

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

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
        if (product) {
          this.product = product;
          this.colors = product.colors || [];
          if (this.colors.length > 0) {
            this.selectedColor = this.colors[0];
            this.selectedImage = this.colors[0].images[0] || '';
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando producto:', err);
        this.error = 'Error al cargar el producto. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  selectColor(color: ProductColor): void {
    this.selectedColor = color;
    this.selectedImage = color.images[0] || '';
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  get allImages(): string[] {
    if (!this.selectedColor) return [];
    return this.selectedColor.images;
  }

  get category(): string {
    if (!this.product || !this.product.categories || !Array.isArray(this.product.categories)) {
      return 'N/A';
    }
    return this.product.categories[0] || 'N/A';
  }

  get createdAt(): string {
    if (!this.product || !this.product.created_at) return 'N/A';
    return new Date(this.product.created_at).toLocaleDateString('es-PE');
  }

  get updatedAt(): string {
    if (!this.product || !this.product.updated_at) return 'N/A';
    return new Date(this.product.updated_at).toLocaleDateString('es-PE');
  }
}
