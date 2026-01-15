import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { HeroComponent } from '../../shared/components/hero/hero.component';
import { CategoriesCarouselComponent } from '../../shared/components/categories-carousel/categories-carousel.component';
import { NewArrivalsComponent } from '../../shared/components/new-arrivals/new-arrivals.component';
import { FlashSaleComponent } from '../../shared/components/flash-sale/flash-sale.component';
import { TestimonialsComponent } from '../../shared/components/testimonials/testimonials.component';
import { GatewayComponent } from '../../shared/components/gateway/gateway.component';
import { PromotionModalComponent } from '../../shared/components/promotion-modal/promotion-modal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    HeroComponent,
    CategoriesCarouselComponent,
    NewArrivalsComponent,
    FlashSaleComponent,
    TestimonialsComponent,
    GatewayComponent,
    PromotionModalComponent
  ],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HomeComponent {}
