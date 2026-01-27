import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-favorite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-favorite.component.html',
  styleUrl: './product-favorite.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ProductFavoriteComponent implements OnInit, OnDestroy {
  @Input() productId!: string;
  isFavorite = false;
  favoriteId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit(): void {
    this.favoritesService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        const fav = favorites.find(f => f.productId === this.productId);
        this.isFavorite = !!fav;
        this.favoriteId = fav ? fav.id : null;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFavorite(): void {
    if (this.isFavorite && this.favoriteId) {
      this.favoritesService.removeFavorite(this.favoriteId).subscribe();
    } else {
      this.favoritesService.addFavorite(this.productId).subscribe();
    }
  }
}
