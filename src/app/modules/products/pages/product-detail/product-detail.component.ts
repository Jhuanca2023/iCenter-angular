import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductsService, Product, ProductColor, ClientProduct } from '../../../../core/services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProductCardComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export default class ProductDetailComponent implements OnInit, OnDestroy {
  productId: string | null = null;
  product: Product | null = null;
  selectedColor: ProductColor | null = null;
  selectedImage = '';
  imageType: 'unique' | 'withColor' = 'withColor';
  colors: ProductColor[] = [];
  uniqueImages: string[] = [];
  relatedProducts: ClientProduct[] = [];
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProduct();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadProduct(): void {
    if (!this.productId) return;
    
    this.isLoading = true;
    this.error = null;
    
    this.subscription = this.productsService.getById(this.productId).subscribe({
      next: (product) => {
        if (product) {
          this.product = product;
          this.colors = product.colors || [];
          
          if (this.colors.length > 0) {
            this.imageType = 'withColor';
            this.selectedColor = this.colors[0];
            this.selectedImage = this.colors[0].images[0] || '';
          } else if (product.image) {
            this.imageType = 'unique';
            this.uniqueImages = [product.image];
            this.selectedImage = product.image;
          }
          
          this.loadRelatedProducts(product);
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

  loadRelatedProducts(currentProduct: Product): void {
    const category = Array.isArray(currentProduct.categories) && currentProduct.categories.length > 0
      ? currentProduct.categories[0]
      : null;
    
    if (!category) return;
    
    this.productsService.searchProducts({
      filters: { category },
      limit: 4
    }).subscribe({
      next: (response) => {
        this.relatedProducts = response.products
          .filter(p => p.id !== Number(currentProduct.id))
          .slice(0, 4);
      },
      error: (err) => {
        console.error('Error cargando productos relacionados:', err);
      }
    });
  }

  get images(): string[] {
    if (this.imageType === 'unique') {
      return this.uniqueImages;
    }
    return this.selectedColor?.images || [];
  }

  get hasColors(): boolean {
    return this.imageType === 'withColor' && this.colors.length > 0;
  }

  selectImage(image: string): void {
    this.selectedImage = image;
  }

  selectColor(color: ProductColor): void {
    this.selectedColor = color;
    if (color.images.length > 0) {
      this.selectedImage = color.images[0];
    }
  }

  getStarsArray(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 1 : 0);
  }
}
