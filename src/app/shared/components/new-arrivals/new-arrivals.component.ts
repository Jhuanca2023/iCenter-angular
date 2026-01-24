import { Component, ViewEncapsulation, ViewChild, ElementRef, HostListener, AfterViewInit, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../../modules/products/components/product-card/product-card.component';
import { ProductsService } from '../../../core/services/products.service';
import { ClientProduct } from '../../../core/interfaces';
import { CategoriesService } from '../../../core/services/categories.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NewArrivalsComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('categoriesContainer', { static: false }) categoriesContainer!: ElementRef;
  @ViewChild('scrollbar', { static: false }) scrollbar!: ElementRef;

  isDragging = false;
  startY = 0;
  startScrollTop = 0;
  scrollbarTopValue = 56; // Inicializar en la segunda categoría (Mobile & Phone)
  products: ClientProduct[] = [];
  categories: Array<{ id: string; name: string; count: number; color: string; active: boolean }> = [];
  isLoading = false;
  private subscription?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private productsService: ProductsService,
    private categoriesService: CategoriesService
  ) { }

  ngAfterViewInit(): void {
    // Inicializar la posición de la barra morada en la categoría activa
    setTimeout(() => {
      const activeIndex = this.activeCategoryIndex;
      if (activeIndex !== -1) {
        this.scrollbarTopValue = activeIndex * 56;
      }
      this.cdr.detectChanges();
    }, 0);
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadData(): void {
    this.isLoading = true;

    this.subscription = this.categoriesService.getAll().subscribe({
      next: (categories) => {
        const colors = [
          'bg-slate-900', 'bg-green-500', 'bg-purple-600', 'bg-slate-400',
          'bg-yellow-500', 'bg-blue-500', 'bg-red-500', 'bg-indigo-500',
          'bg-pink-500', 'bg-cyan-500'
        ];

        this.categories = categories.slice(0, 10).map((cat, index) => ({
          id: cat.id,
          name: cat.name,
          count: 0,
          color: colors[index % colors.length],
          active: index === 1
        }));

        if (this.categories.length > 0) {
          this.loadProducts();
        }
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.isLoading = false;
      }
    });
  }

  loadProducts(categoryName?: string): void {
    this.isLoading = true;

    const params: any = {
      limit: 6,
      sort: 'relevance'
    };

    if (categoryName) {
      params.filters = { category: categoryName };
    }

    this.subscription = this.productsService.searchProducts(params).subscribe({
      next: (response) => {
        this.products = response.products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando productos:', err);
        this.isLoading = false;
      }
    });
  }

  get activeCategoryIndex(): number {
    return this.categories.findIndex(c => c.active);
  }

  get scrollbarTop(): number {
    // La barra morada está fija en su posición, no se mueve con el scroll
    return this.scrollbarTopValue;
  }

  onCategoryClick(category: any): void {
    this.categories.forEach(c => c.active = false);
    category.active = true;

    if (this.categoriesContainer) {
      const index = this.categories.findIndex(c => c.id === category.id);
      const container = this.categoriesContainer.nativeElement;
      const itemHeight = 56;
      container.scrollTop = index * itemHeight;
      // Actualizar posición de la barra morada según la categoría activa
      this.scrollbarTopValue = index * 56;
    }

    this.loadProducts(category.name);
  }

  onScrollbarMouseDown(event: MouseEvent): void {
    this.isDragging = true;
    this.startY = event.clientY;
    if (this.categoriesContainer) {
      this.startScrollTop = this.categoriesContainer.nativeElement.scrollTop;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.categoriesContainer) return;

    const container = this.categoriesContainer.nativeElement;
    const containerRect = container.getBoundingClientRect();
    const deltaY = event.clientY - this.startY;
    const containerHeight = container.clientHeight;
    const scrollbarHeight = 40;
    const maxScrollbarTop = containerHeight - scrollbarHeight;
    const scrollHeight = container.scrollHeight - container.clientHeight;

    const scrollbarStartY = this.startY - containerRect.top;
    const currentScrollbarTop = Math.max(0, Math.min(maxScrollbarTop, scrollbarStartY - scrollbarHeight / 2));
    const newScrollbarTop = Math.max(0, Math.min(maxScrollbarTop, currentScrollbarTop + deltaY));

    if (scrollHeight > 0 && maxScrollbarTop > 0) {
      const scrollRatio = newScrollbarTop / maxScrollbarTop;
      container.scrollTop = scrollRatio * scrollHeight;
    }

    this.startY = event.clientY;
    this.scrollbarTopValue = newScrollbarTop;
    this.updateActiveCategoryFromScroll();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    this.isDragging = false;
  }

  onContainerScroll(): void {
    // La barra morada NO se mueve con el scroll, solo se actualiza la categoría activa
    if (!this.isDragging) {
      this.updateActiveCategoryFromScroll();
    }
  }

  updateActiveCategoryFromScroll(): void {
    if (!this.categoriesContainer) return;
    const container = this.categoriesContainer.nativeElement;
    const scrollTop = container.scrollTop;
    const itemHeight = 56;
    const activeIndex = Math.round(scrollTop / itemHeight);

    this.categories.forEach((c, i) => {
      c.active = i === activeIndex;
    });
  }

}
