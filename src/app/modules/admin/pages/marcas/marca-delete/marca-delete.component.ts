import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { BrandsService } from '../../../../../core/services/brands.service';
import { Marca } from '../../../interfaces/marca.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-marca-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './marca-delete.component.html',
  styleUrl: './marca-delete.component.css'
})
export default class MarcaDeleteComponent implements OnInit, OnDestroy {
  marcaId: string | null = null;
  marca: Marca | null = null;
  showConfirmModal = true;
  isLoading = false;
  isDeleting = false;
  error: string | null = null;
  private subscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Marcas', route: '/admin/marcas' },
    { label: 'Eliminar' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brandsService: BrandsService
  ) {}

  ngOnInit(): void {
    this.marcaId = this.route.snapshot.paramMap.get('id');
    this.loadMarcaData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
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
      },
      error: (err) => {
        console.error('Error cargando marca:', err);
        this.error = 'Error al cargar la marca. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  confirmDelete(): void {
    if (!this.marcaId) return;

    this.isDeleting = true;
    this.error = null;

    this.brandsService.delete(this.marcaId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.router.navigate(['/admin/marcas']);
      },
      error: (err) => {
        console.error('Error eliminando marca:', err);
        this.error = err.message || 'Error al eliminar la marca. Por favor, intenta nuevamente.';
        this.isDeleting = false;
      }
    });
  }

  cancelDelete(): void {
    this.router.navigate(['/admin/marcas']);
  }
}
