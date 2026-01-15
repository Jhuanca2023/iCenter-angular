import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export default class CategoryDetailComponent implements OnInit {
  categoryId: string | null = null;
  category: any = null;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Categorías', route: '/admin/categories' },
    { label: 'Detalle' }
  ];

  constructor(private route: ActivatedRoute) {}

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
      productCount: 8,
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop',
      visible: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    };
  }
}
