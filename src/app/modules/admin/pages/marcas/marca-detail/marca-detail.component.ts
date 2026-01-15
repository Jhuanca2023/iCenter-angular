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
      id: parseInt(this.marcaId || '1'),
      name: 'Apple',
      description: 'Marca líder en tecnología y dispositivos electrónicos',
      productCount: 12,
      categories: ['Smartphones', 'Laptops', 'Wearables'],
      visible: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    };
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
