import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-category-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './category-delete.component.html',
  styleUrl: './category-delete.component.css'
})
export default class CategoryDeleteComponent implements OnInit {
  categoryId: string | null = null;
  category: any = null;
  showConfirmModal = true;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Categorías', route: '/admin/categories' },
    { label: 'Eliminar' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.loadCategoryData();
  }

  loadCategoryData(): void {
    // Mock data
    this.category = {
      id: this.categoryId,
      name: 'Gaming',
      description: 'Dispositivos de gaming',
      productCount: 8
    };
  }

  confirmDelete(): void {
    console.log('Categoría eliminada:', this.categoryId);
    this.router.navigate(['/admin/categories']);
  }

  cancelDelete(): void {
    this.router.navigate(['/admin/categories']);
  }
}
