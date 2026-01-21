import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClaimsService } from '../../../../../core/services/claims.service';
import { Claim } from '../../../../../core/models/claim.model';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-archivados',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './archivados.component.html',
    styleUrl: './archivados.component.css'
})
export class ArchivadosComponent implements OnInit {
    claims: Claim[] = [];
    filteredClaims: Claim[] = [];
    isLoading = true;
    searchQuery = '';

    constructor(private claimsService: ClaimsService) { }

    ngOnInit(): void {
        this.loadArchivedClaims();
    }

    loadArchivedClaims(): void {
        this.isLoading = true;
        this.claimsService.getAllClaims().subscribe({
            next: (claims) => {
                // Filtrar solo los reclamos archivados
                this.claims = claims.filter(claim => claim.status === 'ARCHIVADO');
                this.filteredClaims = [...this.claims];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading archived claims:', err);
                this.isLoading = false;
            }
        });
    }

    onSearch(): void {
        const query = this.searchQuery.toLowerCase().trim();
        if (!query) {
            this.filteredClaims = [...this.claims];
            return;
        }

        this.filteredClaims = this.claims.filter(claim =>
            claim.claim_code.toLowerCase().includes(query) ||
            claim.consumer_name.toLowerCase().includes(query) ||
            claim.consumer_lastname.toLowerCase().includes(query) ||
            claim.email.toLowerCase().includes(query) ||
            claim.document_number.toLowerCase().includes(query)
        );
    }

    getStatusClass(status: string): string {
        const classes: { [key: string]: string } = {
            'ARCHIVADO': 'bg-slate-100 text-slate-700'
        };
        return classes[status] || 'bg-gray-100 text-gray-700';
    }

    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
}
