import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimsService } from '../../../../../core/services/claims.service';
import { Claim } from '../../../../../core/models/claim.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-claims-en-proceso',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './en-proceso.component.html'
})
export class ClaimsEnProcesoComponent implements OnInit, OnDestroy {
    claims: Claim[] = [];
    filteredClaims: Claim[] = [];
    isLoading = true;
    error: string | null = null;
    searchQuery = '';

    currentPage = 1;
    pageSize = 10;
    totalPages = 1;

    private subscription?: Subscription;

    constructor(private claimsService: ClaimsService) { }

    ngOnInit(): void {
        this.loadClaims();
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    loadClaims(): void {
        this.isLoading = true;
        this.subscription = this.claimsService.getAllClaims().subscribe({
            next: (claims) => {
                this.claims = claims.filter(c => c.status === 'EN PROCESO');
                this.applyFilter();
                this.isLoading = false;
            },
            error: () => {
                this.error = 'Error al cargar los reclamos en proceso.';
                this.isLoading = false;
            }
        });
    }

    onSearch(): void {
        this.currentPage = 1;
        this.applyFilter();
    }

    applyFilter(): void {
        let result = this.claims;
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(c =>
                c.claim_code.toLowerCase().includes(query) ||
                c.consumer_name.toLowerCase().includes(query) ||
                c.consumer_lastname.toLowerCase().includes(query)
            );
        }
        this.filteredClaims = result;
        this.totalPages = Math.ceil(this.filteredClaims.length / this.pageSize);
    }

    get paginatedClaims(): Claim[] {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredClaims.slice(start, start + this.pageSize);
    }
}
