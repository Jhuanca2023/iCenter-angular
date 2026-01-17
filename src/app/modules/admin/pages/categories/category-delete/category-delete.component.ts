import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { CategoriesService } from '../../../../../core/services/categories.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-category-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './category-delete.component.html',
  styleUrl: './category-delete.component.css'
})
export default class CategoryDeleteComponent implements OnInit, OnDestroy {
  categoryId: string | null = null;
  category: any = null;
  showConfirmModal = true;
  isLoading = false;
  error: string | null = null;
  private subscription?: Subscription;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Categorías', route: '/admin/categories' },
    { label: 'Eliminar' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
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
  }

  loadCategoryData(): void {
    if (!this.categoryId) return;
    
    this.isLoading = true;
    this.subscription = this.categoriesService.getById(this.categoryId).subscribe({
      next: (category) => {
        if (category) {
          this.category = category;
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

  confirmDelete(): void {
    if (!this.categoryId) return;
    
    this.isLoading = true;
    this.subscription = this.categoriesService.delete(this.categoryId).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        console.error('Error eliminando categoría:', err);
        this.error = err.message || 'Error al eliminar la categoría.';
        this.isLoading = false;
      }
    });
  }

  cancelDelete(): void {
    this.router.navigate(['/admin/categories']);
  }
}
