import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-favorite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-favorite.component.html',
  styleUrl: './product-favorite.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductFavoriteComponent {
  @Input() productId!: number;
  @Input() isFavorite = false;
  @Output() favoriteToggle = new EventEmitter<{ productId: number; isFavorite: boolean }>();

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.favoriteToggle.emit({ productId: this.productId, isFavorite: this.isFavorite });
  }
}
