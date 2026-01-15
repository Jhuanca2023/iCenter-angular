import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-user-report',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent],
  templateUrl: './user-report.component.html',
  styleUrl: './user-report.component.css'
})
export default class UserReportComponent {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Usuarios', route: '/admin/users' },
    { label: 'Reporte' }
  ];

  reportData = {
    totalUsers: 15,
    activeUsers: 12,
    inactiveUsers: 3,
    adminUsers: 2,
    regularUsers: 13,
    usersByMonth: [
      { month: 'Enero', count: 5 },
      { month: 'Febrero', count: 8 },
      { month: 'Marzo', count: 10 },
      { month: 'Abril', count: 12 },
      { month: 'Mayo', count: 15 }
    ],
    recentUsers: [
      { name: 'Juan Pérez', email: 'juan@example.com', role: 'Usuario', createdAt: '2025-05-03' },
      { name: 'María García', email: 'maria@example.com', role: 'Usuario', createdAt: '2025-05-02' },
      { name: 'Ana Martínez', email: 'ana@example.com', role: 'Administrador', createdAt: '2025-04-28' }
    ]
  };

  exportReport(): void {
    console.log('Exportando reporte de usuarios...');
  }

  printReport(): void {
    window.print();
  }
}