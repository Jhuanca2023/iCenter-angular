import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-marca-delete',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './marca-delete.component.html',
  styleUrl: './marca-delete.component.css'
})
export default class MarcaDeleteComponent implements OnInit {
  marcaId: string | null = null;
  marca: any = null;
  showConfirmModal = true;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Marcas', route: '/admin/marcas' },
    { label: 'Eliminar' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.marcaId = this.route.snapshot.paramMap.get('id');
    this.loadMarcaData();
  }

  loadMarcaData(): void {
    // Mock data
    this.marca = {
      id: this.marcaId,
      name: 'Apple',
      description: 'Marca líder en tecnología',
      productCount: 12
    };
  }

  confirmDelete(): void {
    console.log('Marca eliminada:', this.marcaId);
    this.router.navigate(['/admin/marcas']);
  }

  cancelDelete(): void {
    this.router.navigate(['/admin/marcas']);
  }
}
