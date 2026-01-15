import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-product-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './product-delete.component.html',
  styleUrl: './product-delete.component.css'
})
export default class ProductDeleteComponent implements OnInit {
  productId: string | null = null;
  product: any = null;
  showConfirmModal = true;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Productos', route: '/admin/productos' },
    { label: 'Eliminar' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadProductData();
  }

  loadProductData(): void {
    // Mock data - en producción vendría de un servicio
    this.product = {
      id: this.productId,
      name: 'CELULAR SAMSUNG GALAXY S24 ULTRA 256GB 12GB RAM 200MP 6.8 GRIS',
      category: 'Smartphones',
      price: 999.99,
      stock: 12
    };
  }

  confirmDelete(): void {
    // Aquí iría la lógica para eliminar el producto
    console.log('Producto eliminado:', this.productId);
    this.router.navigate(['/admin/productos']);
  }

  cancelDelete(): void {
    this.router.navigate(['/admin/productos']);
  }
}
