import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

interface ProductColor {
  name: string;
  hex: string;
  images: string[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export default class ProductDetailComponent implements OnInit {
  productId: string | null = null;
  product: any = null;
  colors: ProductColor[] = [];
  selectedColor: ProductColor | null = null;
  selectedImage: string = '';

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Productos', route: '/admin/productos' },
    { label: 'Detalle' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.loadProductData();
  }

  loadProductData(): void {
    // Mock data - en producción vendría de un servicio
    this.product = {
      id: this.productId,
      name: 'CELULAR SAMSUNG GALAXY S24 ULTRA 256GB 12GB RAM 200MP 6.8 GRIS',
      description: 'Smartphone Samsung Galaxy S24 Ultra con 256GB de almacenamiento, 12GB RAM, cámara de 200MP y pantalla de 6.8 pulgadas.',
      category: 'Smartphones',
      price: 999.99,
      stock: 12,
      status: 'Activo',
      visible: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    };

    this.colors = [
      {
        name: 'Gris',
        hex: '#808080',
        images: [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop'
        ]
      },
      {
        name: 'Negro',
        hex: '#000000',
        images: [
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
          'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop'
        ]
      }
    ];
    this.selectedColor = this.colors[0];
    this.selectedImage = this.colors[0].images[0];
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
}
