import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { CategoriesCarouselComponent } from '../../shared/components/categories-carousel/categories-carousel.component';
import { NewArrivalsComponent } from '../../shared/components/new-arrivals/new-arrivals.component';
import { FlashSaleComponent } from '../../shared/components/flash-sale/flash-sale.component';
import { TestimonialsComponent } from '../../shared/components/testimonials/testimonials.component';
import { GatewayComponent } from '../../shared/components/gateway/gateway.component';
import { PromotionModalComponent } from '../../shared/components/promotion-modal/promotion-modal.component';
import { BestSellersComponent } from '../../shared/components/best-sellers/best-sellers.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    CategoriesCarouselComponent,
    NewArrivalsComponent,
    FlashSaleComponent,
    TestimonialsComponent,
    GatewayComponent,
    PromotionModalComponent,
    BestSellersComponent
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {}
