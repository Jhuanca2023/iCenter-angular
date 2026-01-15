import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-marca-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './marca-detail.component.html',
  styleUrl: './marca-detail.component.css'
})
export default class MarcaDetailComponent implements OnInit {
  marcaId: string | null = null;
  marca: any = null;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Marcas', route: '/admin/marcas' },
    { label: 'Detalle' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.marcaId = this.route.snapshot.paramMap.get('id');
    this.loadMarcaData();
  }

  loadMarcaData(): void {
    // Mock data
    this.marca = {
      id: this.marcaId,
      name: 'Apple',
      description: 'Marca líder en tecnología y dispositivos electrónicos',
      productCount: 12,
      logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=400&fit=crop',
      categories: ['Smartphones', 'Laptops', 'Wearables'],
      visible: true,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    };
  }
}
