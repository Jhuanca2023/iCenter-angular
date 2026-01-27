import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductQuantitySelectorComponent } from '../../components/product-quantity-selector/product-quantity-selector.component';
import { ProductFavoriteComponent } from '../../components/product-favorite/product-favorite.component';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { ProductsService } from '../../../../core/services/products.service';
import { Product, ProductColor, ClientProduct } from '../../../../core/interfaces';
import { CartService } from '../../../../core/services/cart.service';
import { ProductReviewsService } from '../../../../core/services/product-reviews.service';
import { ProductRatingSummary } from '../../../../core/interfaces/product.interface';
import { ResenaListComponent } from '../../../../modules/resenas/components/resena-list/resena-list.component';
import { AuthService, AuthUser } from '../../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ProductQuantitySelectorComponent,
    BreadcrumbsComponent,
    ResenaListComponent,
    ProductFavoriteComponent
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})

export default class ProductDetailComponent implements OnInit, OnDestroy {
  productId: string | null = null;
  product: Product | null = null;
  breadcrumbs: BreadcrumbItem[] = [];
  selectedColor: ProductColor | null = null;
  selectedImage = '';
  imageType: 'unique' | 'withColor' = 'withColor';
  colors: ProductColor[] = [];
  uniqueImages: string[] = [];
  // relatedProducts removed as per redesign
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
  quantity: number = 1; // New quantity property

  activeTab: 'description' | 'reviews' = 'description';

  protected Math = Math;

  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private cartService: CartService,
    private productReviewsService: ProductReviewsService,
    private authService: AuthService,
    private router: Router
  ) { }

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
          this.updateBreadcrumbs();
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

          // loadRelatedProducts removed
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

  // loadRelatedProducts method removed

  updateBreadcrumbs(): void {
    if (!this.product) return;

    this.breadcrumbs = [
      { label: 'Inicio', route: '/' },
      { label: 'Productos', route: '/productos' }
    ];

    if (this.productCategories.length > 0) {
      this.productCategories.forEach(cat => {
        this.breadcrumbs.push({
          label: cat,
          route: '/productos',
          // Note: In a real app, you'd add queryParams here if the component supported it
          // For now, we'll just link to the main products page
        });
      });
    } else if (this.productBrand) {
      this.breadcrumbs.push({
        label: this.productBrand,
        route: '/productos'
      });
    }

    this.breadcrumbs.push({ label: this.product.name });
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
    if (Array.isArray(this.product?.category_names) && this.product.category_names.length > 0) {
      return this.product.category_names[0];
    }
    return 'Sin categoría';
  }

  get productBrand(): string {
    return this.product?.brand || '';
  }

  get productCategories(): string[] {
    if (Array.isArray(this.product?.category_names)) {
      return this.product.category_names;
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

  addItemToCart(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

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
      this.quantity
    );
    // Optionally, show a success message or update cart icon
  }

  buyNow(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.product) {
      return;
    }
    // Add item to cart with selected quantity
    this.cartService.addItem(
      {
        id: this.product.id || '',
        name: this.product.name,
        price: this.finalPrice,
        originalPrice: this.originalPrice,
        image: this.product.image
      },
      this.quantity
    );
    // Navigate to checkout page
    this.router.navigate(['/checkout']);
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
    this.productReviewsService.saveReview(this.productId, this.currentUser.id, rating).subscribe({
      next: () => {
        this.userRating = rating;
        this.loadProductRating();
      },
      error: (err) => {
        console.error('Error guardando calificación:', err);
      }
    });
  }

  onQuantityChange(newQuantity: number): void {
    this.quantity = newQuantity;
  }
}
