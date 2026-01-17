import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { BrandsService } from '../../../../../core/services/brands.service';
import { ProductsService, Product } from '../../../../../core/services/products.service';
import { Marca } from '../../../interfaces/marca.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-marca-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './marca-detail.component.html',
  styleUrl: './marca-detail.component.css'
})
export default class MarcaDetailComponent implements OnInit, OnDestroy {
  marcaId: string | null = null;
  marca: Marca | null = null;
  products: Product[] = [];
  isLoading = false;
  isLoadingProducts = false;
  error: string | null = null;
  private subscription?: Subscription;
  private productsSubscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Marcas', route: '/admin/marcas' },
    { label: 'Detalle' }
  ];

  constructor(
    private route: ActivatedRoute,
    private brandsService: BrandsService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.marcaId = params.get('id');
      if (this.marcaId) {
        this.loadMarcaData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  loadMarcaData(): void {
    if (!this.marcaId) return;
    
    this.isLoading = true;
    this.error = null;

    this.subscription = this.brandsService.getById(this.marcaId).subscribe({
      next: (marca) => {
        this.marca = marca;
        this.isLoading = false;
        if (marca) {
          this.loadProducts();
        }
      },
      error: (err) => {
        console.error('Error cargando marca:', err);
        this.error = 'Error al cargar la marca. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  loadProducts(): void {
    if (!this.marcaId) return;
    
    this.isLoadingProducts = true;
    this.productsSubscription = this.productsService.getByBrandId(this.marcaId).subscribe({
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
}
