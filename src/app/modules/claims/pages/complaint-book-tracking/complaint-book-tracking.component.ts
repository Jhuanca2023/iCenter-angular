import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClaimsService } from '../../../../core/services/claims.service';
import { Claim, ClaimHistory } from '../../../../core/models/claim.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-complaint-book-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './complaint-book-tracking.component.html',
  styleUrl: './complaint-book-tracking.component.css'
})
export class ComplaintBookTrackingComponent implements OnInit {
  trackingForm: FormGroup;
  claim: Claim | null = null;
  history: ClaimHistory[] = [];
  isLoading = false;
  hasSearched = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private claimsService: ClaimsService
  ) {
    this.trackingForm = this.fb.group({
      claimCode: ['', [Validators.required, Validators.pattern(/^LR-\d{4}-\d{6}$/)]],
      identifier: ['', [Validators.required]]
    });
  }

  ngOnInit(): void { }

  onTrack(): void {
    if (this.trackingForm.invalid) {
      this.trackingForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.claim = null;
    this.history = [];
    this.hasSearched = true;

    const { claimCode, identifier } = this.trackingForm.value;

    this.claimsService.getClaimByCodeAndIdentifier(claimCode, identifier)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (claim) => {
          if (claim) {
            this.claim = claim;
            this.loadHistory(claim.id!);
          } else {
            this.error = 'No se encontró ningún reclamo con el código e identificador proporcionados.';
          }
        },
        error: (err) => {
          console.error('Error tracking claim:', err);
          this.error = 'Ocurrió un error al buscar el reclamo. Por favor, intente más tarde.';
        }
      });
  }

  loadHistory(claimId: string): void {
    this.claimsService.getClaimHistory(claimId).subscribe({
      next: (history) => {
        this.history = history;
      },
      error: (err) => {
        console.error('Error loading history:', err);
      }
    });
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

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'clock';
      case 'EN PROCESO': return 'trending-up';
      case 'COMPLETADO': return 'check-circle';
      case 'ARCHIVADO': return 'archive';
      default: return 'help-circle';
    }
  }
}
