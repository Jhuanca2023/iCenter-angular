import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductsService, Product, ProductColor, ClientProduct } from '../../../../core/services/products.service';
import { CartService } from '../../../../core/services/cart.service';
import { ProductReviewsService, ProductRatingSummary } from '../../../../core/services/product-reviews.service';
import { AuthService, AuthUser } from '../../../../core/services/auth.service';
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
  showFullDescription = false;
  zoomActive = false;
  zoomX = 0;
  zoomY = 0;
  ratingAverage = 0;
  ratingCount = 0;
  userRating = 0;
  currentUser: AuthUser | null = null;
  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private productReviewsService: ProductReviewsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.currentUser = this.authService.getCurrentUser();
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
            this.selectedImage = this.colors[0].images && this.colors[0].images.length > 0 
              ? this.colors[0].images[0] 
              : (product.image || '');
          } else {
            this.imageType = 'unique';
            this.uniqueImages = product.image ? [product.image] : [];
            this.selectedImage = product.image || '';
          }
          
          // Si no hay imagen seleccionada pero hay producto, usar imagen del producto
          if (!this.selectedImage && product.image) {
            this.selectedImage = product.image;
            if (this.imageType === 'unique' && this.uniqueImages.length === 0) {
              this.uniqueImages = [product.image];
            }
          }
          
          this.loadRelatedProducts(product);
          this.loadProductRating();
        } else {
          this.error = 'Producto no encontrado';
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

  get hasDiscount(): boolean {
    return !!(this.product?.on_sale && this.product?.sale_price);
  }

  get originalPrice(): number {
    return this.product?.price || 0;
  }

  get finalPrice(): number {
    if (this.hasDiscount && this.product?.sale_price) {
      return this.product.sale_price;
    }
    return this.product?.price || 0;
  }

  get discountPercentage(): number {
    if (this.hasDiscount && this.product?.sale_price && this.product?.price) {
      return Math.round(((this.product.price - this.product.sale_price) / this.product.price) * 100);
    }
    return 0;
  }

  get productCategory(): string {
    if (Array.isArray(this.product?.categories) && this.product.categories.length > 0) {
      return this.product.categories[0];
    }
    return 'Sin categoría';
  }

  get productBrand(): string {
    return this.product?.brand || '';
  }

  get productCategories(): string[] {
    if (Array.isArray(this.product?.categories)) {
      return this.product.categories;
    }
    return [];
  }

  toggleDescription(): void {
    this.showFullDescription = !this.showFullDescription;
  }

  get shortDescription(): string {
    if (!this.product?.description) return 'Sin descripción disponible';
    const maxLength = 150;
    if (this.product.description.length <= maxLength) {
      return this.product.description;
    }
    return this.product.description.substring(0, maxLength) + '...';
  }

  onImageMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    this.zoomX = x;
    this.zoomY = y;
  }

  onImageMouseEnter(): void {
    this.zoomActive = true;
  }

  onImageMouseLeave(): void {
    this.zoomActive = false;
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }
    this.cartService.addItem(
      {
        id: this.product.id || '',
        name: this.product.name,
        price: this.finalPrice,
        originalPrice: this.originalPrice,
        image: this.product.image
      },
      1
    );
  }

  loadProductRating(): void {
    if (!this.productId) {
      return;
    }
    const userId = this.currentUser?.id;
    this.productReviewsService.getRating(this.productId, userId).subscribe({
      next: (summary: ProductRatingSummary) => {
        this.ratingAverage = summary.average;
        this.ratingCount = summary.count;
        this.userRating = summary.userRating || 0;
      },
      error: (err) => {
        console.error('Error cargando calificación del producto:', err);
      }
    });
  }

  setRating(rating: number): void {
    if (!this.productId) {
      return;
    }
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      return;
    }
    this.productReviewsService.setRating(this.productId, this.currentUser.id, rating).subscribe({
      next: () => {
        this.userRating = rating;
        this.loadProductRating();
      },
      error: (err) => {
        console.error('Error guardando calificación:', err);
      }
    });
  }
}
