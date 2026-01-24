import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../../../modules/favorites/services/favorites.service';
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
  private destroy$ = new Subject<void>();

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit(): void {
    this.favoritesService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favorites => {
        this.isFavorite = favorites.some(fav => fav.productId === this.productId);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      // Find the favorite entry to get its ID
      this.favoritesService.favorites$
        .pipe(takeUntil(this.destroy$))
        .subscribe(favorites => {
          const favoriteToRemove = favorites.find(fav => fav.productId === this.productId);
          if (favoriteToRemove) {
            this.favoritesService.removeFavorite(favoriteToRemove.id).subscribe();
          }
        });
    } else {
      this.favoritesService.addFavorite(this.productId).subscribe();
    }
  }
}
