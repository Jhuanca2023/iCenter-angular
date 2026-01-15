import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'E-Commerce', route: '/admin' },
    { label: 'Dashboard' }
  ];
  @ViewChild('barChart') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('doughnutChart') doughnutChartCanvas!: ElementRef<HTMLCanvasElement>;

  barChart: Chart | null = null;
  doughnutChart: Chart | null = null;

  stats = [
    { 
      title: 'Usuarios activos', 
      value: '7', 
      change: '+46.7%', 
      subtitle: '15 nuevos esta semana',
      icon: 'users',
      trend: 'up'
    },
    { 
      title: 'Productos totales', 
      value: '45', 
      change: '+100%', 
      subtitle: '10 productos con poco stock',
      icon: 'products',
      trend: 'up'
    },
    { 
      title: 'Categorías', 
      value: '8', 
      change: '+0%', 
      subtitle: '5 categorías activas',
      icon: 'categories',
      trend: 'neutral'
    },
    { 
      title: 'Usuarios totales', 
      value: '15', 
      change: '+100%', 
      subtitle: '47% activos actualmente',
      icon: 'total-users',
      trend: 'up'
    }
  ];

  lowStockProducts = [
    { name: 'CELULAR XIAOMI REDMI 14C', stock: 0, status: 'Sin stock' },
    { name: 'CELULAR HONOR MAGIC7 LITE', stock: 1, status: 'Crítico' },
    { name: 'TELEVISOR SMART TV SAMSUNG', stock: 1, status: 'Crítico' },
    { name: 'SMARTPHONE SAMSUNG GALAXY', stock: 2, status: 'Crítico' },
    { name: 'LAPTOP LENOVO LOQ INTEL C', stock: 2, status: 'Crítico' },
    { name: 'CONSOLA DE 10MIL JUEGOS', stock: 3, status: 'Bajo' },
    { name: 'AUDÍFONOS SONY TRUE WIRELESS', stock: 3, status: 'Bajo' },
    { name: 'IMPRESORA MULTIFUNCIONAL HP', stock: 3, status: 'Bajo' }
  ];

  categoryDistribution = [
    { category: 'Gaming', products: 8, percentage: 18, color: '#6366f1' },
    { category: 'Laptops', products: 7, percentage: 16, color: '#ec4899' },
    { category: 'Smartphones', products: 7, percentage: 16, color: '#22c55e' },
    { category: 'Audio', products: 5, percentage: 11, color: '#fb923c' },
    { category: 'Wearables', products: 5, percentage: 11, color: '#a855f7' }
  ];

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initBarChart();
      this.initDoughnutChart();
    }, 100);
  }

  initBarChart(): void {
    if (!this.barChartCanvas?.nativeElement) return;

    const labels = this.lowStockProducts.map(p => 
      p.name.length > 25 ? p.name.substring(0, 25) + '...' : p.name
    );
    const data = this.lowStockProducts.map(p => p.stock);

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Stock',
          data,
          backgroundColor: 'rgba(251, 146, 60, 0.8)',
          borderColor: 'rgba(251, 146, 60, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 3,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    };

    this.barChart = new Chart(this.barChartCanvas.nativeElement, config);
  }

  initDoughnutChart(): void {
    if (!this.doughnutChartCanvas?.nativeElement) return;

    const labels = this.categoryDistribution.map(c => c.category);
    const data = this.categoryDistribution.map(c => c.products);
    const colors = this.categoryDistribution.map(c => c.color + '80');

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    };

    this.doughnutChart = new Chart(this.doughnutChartCanvas.nativeElement, config);
  }

  getCurrentDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  ngOnDestroy(): void {
    if (this.barChart) {
      this.barChart.destroy();
      this.barChart = null;
    }
    if (this.doughnutChart) {
      this.doughnutChart.destroy();
      this.doughnutChart = null;
    }
  }
}
