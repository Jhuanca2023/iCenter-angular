import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CategoriesService, Category } from '../../../core/services/categories.service';
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
  categories: Category[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
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

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
    this.closeMenu();
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
    this.closeMenu();
  }
}
