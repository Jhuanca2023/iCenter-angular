import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-quantity-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-quantity-selector.component.html',
  styleUrl: './product-quantity-selector.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductQuantitySelectorComponent {
  @Input() quantity: number = 1;
  @Input() maxQuantity: number = 1;
  @Output() quantityChange = new EventEmitter<number>();

  incrementQuantity(): void {
    if (this.quantity < this.maxQuantity) {
      this.quantity++;
      this.quantityChange.emit(this.quantity);
    }
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }
}
