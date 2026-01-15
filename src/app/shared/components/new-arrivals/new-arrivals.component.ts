import { Component, ViewEncapsulation, ViewChild, ElementRef, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from '../../../modules/products/components/product-card/product-card.component';

@Component({
  selector: 'app-new-arrivals',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './new-arrivals.component.html',
  styleUrl: './new-arrivals.component.css',
  encapsulation: ViewEncapsulation.None
})
export class NewArrivalsComponent implements AfterViewInit {
  @ViewChild('categoriesContainer', { static: false }) categoriesContainer!: ElementRef;
  @ViewChild('scrollbar', { static: false }) scrollbar!: ElementRef;

  isDragging = false;
  startY = 0;
  startScrollTop = 0;
  scrollbarTopValue = 56; // Inicializar en la segunda categoría (Mobile & Phone)

  constructor(private cdr: ChangeDetectorRef) {}

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

  categories = [
    { id: 1, name: 'Computer & Laptop', count: 15, color: 'bg-slate-900', active: false },
    { id: 2, name: 'Mobile & Phone', count: 35, color: 'bg-green-500', active: true },
    { id: 3, name: 'Camera Imaging', count: 10, color: 'bg-purple-600', active: false },
    { id: 4, name: 'TV & Smart Box', count: 8, color: 'bg-slate-400', active: false },
    { id: 5, name: 'Home Appliance', count: 2, color: 'bg-yellow-500', active: false },
    { id: 6, name: 'Gaming', count: 12, color: 'bg-blue-500', active: false },
    { id: 7, name: 'Audio', count: 18, color: 'bg-red-500', active: false },
    { id: 8, name: 'Smart Home', count: 7, color: 'bg-indigo-500', active: false },
    { id: 9, name: 'Wearables', count: 14, color: 'bg-pink-500', active: false },
    { id: 10, name: 'Tablets', count: 6, color: 'bg-cyan-500', active: false }
  ];

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

  products = [
    {
      id: 1,
      name: 'Xiphone 14 Pro Maxe',
      category: 'Smartphones',
      price: 175,
      originalPrice: 200,
      description: 'Lorem ipsum dolor sit amet consectetur. Eleifend nec morbi tellus vitae leo nunc.',
      rating: 4,
      reviews: 121,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Xiphone 13',
      category: 'Smartphones',
      price: 100,
      originalPrice: 150,
      description: 'Lorem ipsum dolor sit amet consectetur. Eleifend nec morbi tellus vitae leo nunc.',
      rating: 4,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Samsonge',
      category: 'Smartphones',
      price: 150,
      originalPrice: 180,
      description: 'Lorem ipsum dolor sit amet consectetur. Eleifend nec morbi tellus vitae leo nunc.',
      rating: 4,
      reviews: 95,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop'
    },
    {
      id: 4,
      name: 'Samsonge Galaxy A Flip',
      category: 'Smartphones',
      price: 225,
      originalPrice: 280,
      description: 'Lorem ipsum dolor sit amet consectetur. Eleifend nec morbi tellus vitae leo nunc.',
      rating: 4,
      reviews: 125,
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop'
    },
    {
      id: 5,
      name: 'Sonxl Xperia 5 II',
      category: 'Smartphones',
      price: 120,
      originalPrice: 160,
      description: 'Lorem ipsum dolor sit amet consectetur. Eleifend nec morbi tellus vitae leo nunc.',
      rating: 4,
      reviews: 100,
      image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300&h=300&fit=crop'
    },
    {
      id: 6,
      name: 'Preomi Re',
      category: 'Smartphones',
      price: 130,
      originalPrice: 170,
      description: 'Lorem ipsum dolor sit amet consectetur. Eleifend nec morbi tellus vitae leo nunc.',
      rating: 4,
      reviews: 110,
      image: 'https://images.unsplash.com/photo-1601972602237-8c79241e468b?w=300&h=300&fit=crop'
    }
  ];
}
