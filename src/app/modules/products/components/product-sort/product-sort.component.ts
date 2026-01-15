import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating';

@Component({
  selector: 'app-product-sort',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-sort.component.html',
  styleUrl: './product-sort.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductSortComponent {
  @Output() sortChange = new EventEmitter<SortOption>();
  selectedSort: SortOption = 'relevance';

  sortOptions = [
    { value: 'relevance', label: 'Relevancia' },
    { value: 'price-asc', label: 'Precio: Menor a Mayor' },
    { value: 'price-desc', label: 'Precio: Mayor a Menor' },
    { value: 'name-asc', label: 'Nombre: A-Z' },
    { value: 'name-desc', label: 'Nombre: Z-A' },
    { value: 'rating', label: 'Mejor Calificados' }
  ];

  onSortChange(): void {
    this.sortChange.emit(this.selectedSort);
  }
}
