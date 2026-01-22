import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { UsersService } from '../../../../core/services/users.service';
import { ProductsService } from '../../../../core/services/products.service';
import { CategoriesService } from '../../../../core/services/categories.service';
import { forkJoin, Subscription } from 'rxjs';

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
      value: '0',
      change: '0%',
      subtitle: 'Cargando...',
      icon: 'users',
      trend: 'neutral' as 'up' | 'down' | 'neutral'
    },
    {
      title: 'Productos totales',
      value: '0',
      change: '0%',
      subtitle: 'Cargando...',
      icon: 'products',
      trend: 'neutral' as 'up' | 'down' | 'neutral'
    },
    {
      title: 'Categorías',
      value: '0',
      change: '0%',
      subtitle: 'Cargando...',
      icon: 'categories',
      trend: 'neutral' as 'up' | 'down' | 'neutral'
    },
    {
      title: 'Usuarios totales',
      value: '0',
      change: '0%',
      subtitle: 'Cargando...',
      icon: 'total-users',
      trend: 'neutral' as 'up' | 'down' | 'neutral'
    }
  ];

  lowStockProducts: Array<{ name: string; stock: number; status: string }> = [];
  categoryDistribution: Array<{ category: string; products: number; percentage: number; color: string }> = [];
  isLoading = false;
  private subscription?: Subscription;

  constructor(
    private usersService: UsersService,
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.subscription = forkJoin({
      users: this.usersService.getAll(),
      products: this.productsService.getAllAdmin(),
      categories: this.categoriesService.getAll()
    }).subscribe({
      next: ({ users, products, categories }) => {
        const activeUsers = users.filter(u => u.status === 'Activo').length;
        const totalUsers = users.length;
        const totalProducts = products.length;
        const lowStock = products.filter(p => p.stock <= 3).slice(0, 8);
        const totalCategories = categories.length;

        this.stats[0].value = activeUsers.toString();
        this.stats[0].subtitle = `${activeUsers} usuarios activos`;
        this.stats[1].value = totalProducts.toString();
        this.stats[1].subtitle = `${lowStock.length} productos con poco stock`;
        this.stats[2].value = totalCategories.toString();
        this.stats[2].subtitle = `${categories.filter(c => c.visible).length} categorías activas`;
        this.stats[3].value = totalUsers.toString();
        this.stats[3].subtitle = `${Math.round((activeUsers / totalUsers) * 100) || 0}% activos actualmente`;

        this.lowStockProducts = lowStock.map(p => ({
          name: p.name,
          stock: p.stock,
          status: p.stock === 0 ? 'Sin stock' : p.stock <= 2 ? 'Crítico' : 'Bajo'
        }));

        const categoryMap = new Map<string, number>();
        products.forEach(p => {
          if (p.category_names && Array.isArray(p.category_names)) {
            p.category_names.forEach(cat => {
              categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
            });
          }
        });

        const colors = ['#6366f1', '#ec4899', '#22c55e', '#fb923c', '#a855f7', '#3b82f6', '#f59e0b'];
        const total = products.length;
        this.categoryDistribution = Array.from(categoryMap.entries())
          .map(([category, count], index) => ({
            category,
            products: count,
            percentage: Math.round((count / total) * 100),
            color: colors[index % colors.length]
          }))
          .sort((a, b) => b.products - a.products)
          .slice(0, 5);

        this.isLoading = false;
        setTimeout(() => {
          this.initBarChart();
          this.initDoughnutChart();
        }, 100);
      },
      error: (err) => {
        console.error('Error cargando datos del dashboard:', err);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.isLoading) {
      setTimeout(() => {
        this.initBarChart();
        this.initDoughnutChart();
      }, 100);
    }
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
