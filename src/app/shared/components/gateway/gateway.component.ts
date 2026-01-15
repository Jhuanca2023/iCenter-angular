import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gateway',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gateway.component.html',
  styleUrl: './gateway.component.css',
  encapsulation: ViewEncapsulation.None
})
export class GatewayComponent {
  searchQuery = '';

  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Buscando:', this.searchQuery);
    }
  }
}
