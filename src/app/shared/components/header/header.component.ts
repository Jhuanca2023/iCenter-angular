import { Component, ViewEncapsulation, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoriesService, Category } from '../../../core/services/categories.service';
import { AuthService, AuthUser } from '../../../core/services/auth.service';
import { CartService, CartState } from '../../../core/services/cart.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isCategoriesDropdownOpen = false;
  isUserMenuOpen = false;
  categories: Category[] = [];
  currentUser: AuthUser | null = null;
  cartQuantity = 0;
  cartTotal = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private categoriesService: CategoriesService,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadCurrentUser();
    this.loadCart();
  }

  loadCurrentUser(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });
  }

  loadCart(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart: CartState) => {
        this.cartQuantity = cart.totalQuantity;
        this.cartTotal = cart.totalAmount;
      });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  goToAdminPanel(): void {
    this.router.navigate(['/admin']);
    this.closeMenu();
    this.closeUserMenu();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = [
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.closeUserMenu();
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCategories(): void {
    this.categoriesService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories: Category[]) => {
          this.categories = categories.filter((cat: Category) => cat.visible);
        },
        error: (error: any) => {
          console.error('Error al cargar categorías:', error);
        }
      });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = !this.isCategoriesDropdownOpen;
  }

  openCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = true;
  }

  closeCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = false;
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/productos'], { queryParams: { categoria: categoryId } });
    this.closeCategoriesDropdown();
  }

  navigateToCategoryByName(categoryName: string): void {
    this.router.navigate(['/productos'], { queryParams: { categoria: categoryName } });
    this.closeCategoriesDropdown();
  }

  navigateToCart(fromMenu: boolean = false): void {
    this.router.navigate(['/carrito']);
    if (fromMenu) {
      this.closeMenu();
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
    this.closeMenu();
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
    this.closeMenu();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.closeUserMenu();
    }
  }
}
