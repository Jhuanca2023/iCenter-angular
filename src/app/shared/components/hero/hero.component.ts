import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannersService } from '@core/services/banners.service';
import { Banner } from '@core/interfaces';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HeroComponent implements OnInit, OnDestroy {
  banners: Banner[] = [];
  currentIndex = 0;
  private interval: any;

  constructor(private bannersService: BannersService) { }

  ngOnInit(): void {
    this.bannersService.getBanners().subscribe(banners => {
      this.banners = banners;
      if (this.banners.length === 0) {
        // Banner por defecto si no hay configurados
        this.banners = [{
          id: 'default',
          title: 'Bienvenido a iCenter',
          subtitle: 'Descubre lo último en tecnología con envío gratis.',
          image_url: 'assets/img/iphone-banner.png',
          link_url: '/productos',
          order_index: 0,
          is_active: true
        }];
      }
      this.startAutoplay();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }

  startAutoplay(): void {
    if (this.banners.length > 1) {
      this.interval = setInterval(() => {
        this.next();
      }, 5000);
    }
  }

  stopAutoplay(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.banners.length;
  }

  prev(): void {
    this.currentIndex = (this.currentIndex - 1 + this.banners.length) % this.banners.length;
  }

  goTo(index: number): void {
    this.currentIndex = index;
    this.stopAutoplay();
    this.startAutoplay();
  }
}
