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
        this.banners = [
          {
            id: '1',
            title: 'Sumérgete en el Sonido',
            subtitle: 'Auriculares cibernéticos inalámbricos de última generación.',
            image_url: 'https://img.freepik.com/foto-gratis/vida-muerta-auriculares-ciberneticos-inalambricos_23-2151072201.jpg?t=st=1769383787~exp=1769387387~hmac=cea1250dddf0e30d4307a1d9a70cb587e6acc31d731e31d381dc6a443c824d47&w=1060',
            link_url: '/productos',
            order_index: 0,
            is_active: true
          },
          {
            id: '2',
            title: 'Domina tu Juego',
            subtitle: 'Configuraciones de escritorio neon para gamers profesionales.',
            image_url: 'https://img.freepik.com/foto-gratis/configuracion-escritorio-juego-neon-iluminado-gradiente-teclado_23-2149529412.jpg?semt=ais_hybrid&w=740&q=80',
            link_url: '/productos',
            order_index: 1,
            is_active: true
          },
          {
            id: '3',
            title: 'Realidad Sin Límites',
            subtitle: 'Explora nuevos mundos con nuestra tecnología de realidad virtual.',
            image_url: 'https://img.freepik.com/foto-gratis/escuchas-realidad-virtual-juegos-futuristas-alta-tecnologia_23-2151133167.jpg?semt=ais_hybrid&w=740&q=80',
            link_url: '/productos',
            order_index: 2,
            is_active: true
          },
          {
            id: '4',
            title: 'Estilo Cyberpunk',
            subtitle: 'Iluminación neon y diseño futurista en cada componente.',
            image_url: 'https://img.freepik.com/foto-gratis/auriculares-inalambricos-iluminacion-neon-al-estilo-cyberpunk_23-2151074303.jpg?semt=ais_hybrid&w=740&q=80',
            link_url: '/productos',
            order_index: 3,
            is_active: true
          },
          {
            id: '5',
            title: 'Precisión Absoluta',
            subtitle: 'Rastreadores y periféricos de alta gama para creadores.',
            image_url: 'https://img.freepik.com/vector-gratis/rastreadores-estilo-realista_23-2148509776.jpg?semt=ais_hybrid&w=740&q=80',
            link_url: '/productos',
            order_index: 4,
            is_active: true
          }
        ];
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
