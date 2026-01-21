import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClaimsService } from '../../../../../core/services/claims.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { Claim, ClaimHistory } from '../../../../../core/models/claim.model';
import { Subscription } from 'rxjs';
import { BreadcrumbsComponent, BreadcrumbItem } from '../../../../../shared/components/breadcrumbs/breadcrumbs.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-claim-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbsComponent, FormsModule],
  templateUrl: './claim-detail.component.html',
  styleUrl: './claim-detail.component.css'
})
export class ClaimDetailComponent implements OnInit, OnDestroy {
  claim: Claim | null = null;
  claimHistory: ClaimHistory[] = [];
  claimId: string | null = null;
  isLoading = true;
  error: string | null = null;
  private routeSubscription?: Subscription;
  private claimSubscription?: Subscription;
  private historySubscription?: Subscription;

  newResponse: string = '';
  selectedStatus: Claim['status'] = 'PENDIENTE';
  showStatusModal = false;

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Administrador', route: '/admin' },
    { label: 'Reclamos', route: '/admin/reclamos' },
    { label: 'Detalle de Reclamo' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private claimsService: ClaimsService,
    private authService: AuthService
  ) { }

  currentAdminId: string | null = null;

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentAdminId = user?.id || null;
    });

    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.claimId = params.get('id');
      if (this.claimId) {
        this.loadClaimDetails(this.claimId);
      } else {
        this.error = 'No se proporcionó ID de reclamo.';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.claimSubscription?.unsubscribe();
    this.historySubscription?.unsubscribe();
  }

  loadClaimDetails(id: string): void {
    this.isLoading = true;
    this.claimSubscription = this.claimsService.getClaimById(id).subscribe({
      next: (claim) => {
        this.claim = claim;
        if (claim) {
          this.selectedStatus = claim.status;
          this.loadClaimHistory(claim.id!);

          // Si entra por primera vez y está PENDIENTE, sugerir cambio a EN PROCESO
          if (claim.status === 'PENDIENTE') {
            this.showStatusModal = true;
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles.';
        this.isLoading = false;
      }
    });
  }

  loadClaimHistory(claimId: string): void {
    this.historySubscription = this.claimsService.getClaimHistory(claimId).subscribe({
      next: (history) => {
        this.claimHistory = history;
      }
    });
  }

  updateClaimStatus(customStatus?: Claim['status']): void {
    if (!this.claimId) return;
    const nextStatus = customStatus || this.selectedStatus;

    this.isLoading = true;
    this.claimsService.updateClaimStatus(this.claimId, nextStatus, this.currentAdminId!).subscribe({
      next: (updatedClaim) => {
        this.claim = updatedClaim;
        this.selectedStatus = updatedClaim.status;
        this.loadClaimHistory(this.claimId!);
        this.isLoading = false;
        this.showStatusModal = false;
      },
      error: () => {
        this.error = 'Error al actualizar el estado.';
        this.isLoading = false;
      }
    });
  }

  submitAdminResponse(): void {
    if (!this.claim || !this.claimId || !this.newResponse.trim() || !this.currentAdminId) return;

    this.isLoading = true;
    this.claimsService.addAdminResponse(this.claimId, this.newResponse, this.currentAdminId).subscribe({
      next: (updatedClaim) => {
        this.claim = updatedClaim;
        this.newResponse = '';
        this.loadClaimHistory(this.claimId!);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Error al enviar respuesta.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/reclamos']);
  }
}
