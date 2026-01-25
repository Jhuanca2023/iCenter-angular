import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrdersService } from '../../../../../core/services/orders.service';
import { Order } from '../../../../../core/interfaces';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
    selector: 'app-admin-order-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, BreadcrumbsComponent],
    templateUrl: './order-detail.component.html',
    styleUrl: './order-detail.component.css'
})
export class AdminOrderDetailComponent implements OnInit {
    order: Order | null = null;
    isLoading = true;
    error: string | null = null;

    breadcrumbs: BreadcrumbItem[] = [
        { label: 'E-Commerce', route: '/admin' },
        { label: 'Pedidos', route: '/admin/orders' },
        { label: 'Detalle de Pedido' }
    ];

    constructor(
        private route: ActivatedRoute,
        private ordersService: OrdersService
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadOrder(id);
        }
    }

    loadOrder(id: string): void {
        this.isLoading = true;
        this.ordersService.getById(id).subscribe({
            next: (order) => {
                this.order = order;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error al cargar pedido:', err);
                this.error = 'No se pudo cargar la información del pedido.';
                this.isLoading = false;
            }
        });
    }

    getStatusColor(status: string): string {
        const statusColors: { [key: string]: string } = {
            'Pendiente': 'bg-amber-100 text-amber-700 border border-amber-200',
            'Confirmado': 'bg-blue-100 text-blue-700 border border-blue-200',
            'En preparación': 'bg-purple-100 text-purple-700 border border-purple-200',
            'En camino': 'bg-indigo-100 text-indigo-700 border border-indigo-200',
            'Entregado': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
            'Cancelado': 'bg-rose-100 text-rose-700 border border-rose-200',
            'Completado': 'bg-green-100 text-green-700 border border-green-200'
        };
        return statusColors[status] || 'bg-slate-100 text-slate-700 border border-slate-200';
    }

    formatDate(date: Date | string | undefined): string {
        if (!date) return '';
        const d = typeof date === 'string' ? new Date(date) : date;
        return d.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(amount);
    }
}
