import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannersService } from '@core/services/banners.service';
import { Promotion } from '@core/interfaces';

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
  promotion: Promotion | null = null;
  private readonly STORAGE_KEY = 'promotion_modal_closed';

  constructor(private bannersService: BannersService) { }

  ngOnInit(): void {
    this.bannersService.getPromotions().subscribe(promos => {
      if (promos.length > 0) {
        this.promotion = promos[0]; // Tomamos la primera activa
        this.checkIfShouldShow();
      }
    });
  }

  ngOnDestroy(): void {
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
