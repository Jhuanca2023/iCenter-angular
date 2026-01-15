import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
    this.closeMenu();
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
    this.closeMenu();
  }
}
