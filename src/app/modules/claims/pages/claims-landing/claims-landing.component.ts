import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../shared/components/breadcrumbs/breadcrumbs.component';

@Component({
    selector: 'app-claims-landing',
    standalone: true,
    imports: [CommonModule, RouterModule, BreadcrumbsComponent],
    templateUrl: './claims-landing.component.html',
    styleUrl: './claims-landing.component.css'
})
export class ClaimsLandingComponent {
    breadcrumbs: BreadcrumbItem[] = [
        { label: 'Inicio', route: '/' },
        { label: 'Libro de Reclamaciones' }
    ];
}
