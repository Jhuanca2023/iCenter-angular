import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promotion-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './promotion-modal.component.html',
  styleUrl: './promotion-modal.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PromotionModalComponent implements OnInit, OnDestroy {
  isOpen = false;
  private readonly STORAGE_KEY = 'promotion_modal_closed';

  ngOnInit(): void {
    this.checkIfShouldShow();
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
  }

  private checkIfShouldShow(): void {
    const wasClosed = localStorage.getItem(this.STORAGE_KEY);
    if (!wasClosed) {
      setTimeout(() => {
        this.isOpen = true;
      }, 500);
    }
  }

  closeModal(): void {
    this.isOpen = false;
    localStorage.setItem(this.STORAGE_KEY, 'true');
  }

  onBackdropClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }
}
