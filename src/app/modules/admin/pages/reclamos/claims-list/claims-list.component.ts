import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClaimsService } from '../../../../../core/services/claims.service';
import { Claim } from '../../../../../core/models/claim.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-claims-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './claims-list.component.html',
  styleUrl: './claims-list.component.css'
})
export class ClaimsListComponent implements OnInit, OnDestroy {
  allClaims: Claim[] = [];
  filteredClaims: Claim[] = [];
  isLoading = true;
  error: string | null = null;
  today = new Date();
  activeTab: 'PENDIENTE' | 'EN PROCESO' | 'COMPLETADO' | 'TODO' = 'PENDIENTE';
  searchQuery = '';

  // Pagination
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
        this.allClaims = claims;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading claims:', err);
        this.error = 'No se pudieron cargar los reclamos.';
        this.isLoading = false;
      }
    });
  }

  setTab(tab: 'PENDIENTE' | 'EN PROCESO' | 'COMPLETADO' | 'TODO'): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.applyFilter();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    let result = this.allClaims;

    // Filter by tab
    if (this.activeTab !== 'TODO') {
      result = result.filter(c => c.status === this.activeTab);
    }

    // Filter by search query
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

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'EN PROCESO': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'COMPLETADO': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'ARCHIVADO': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  }
}
