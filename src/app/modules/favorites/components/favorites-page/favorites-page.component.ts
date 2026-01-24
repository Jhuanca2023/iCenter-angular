import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { Favorite, FavoriteFolder } from '../../../../core/interfaces/favorite.interface';
import { Subject, takeUntil } from 'rxjs';
import { ClientProduct } from '../../../../core/interfaces/product.interface';
import { ProductCardComponent } from '../../../products/components/product-card/product-card.component';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './favorites-page.component.html',
  styleUrl: './favorites-page.component.css',
  encapsulation: ViewEncapsulation.None
})
export class FavoritesPageComponent implements OnInit, OnDestroy {
  favorites: Favorite[] = [];
  favoriteFolders: FavoriteFolder[] = [];
  filteredFavorites: Favorite[] = [];
  currentFolder: string = '';
  private destroy$ = new Subject<void>();

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit(): void {
    this.favoritesService.favorites$
      .pipe(takeUntil(this.destroy$))
      .subscribe((favorites: Favorite[]) => {
        this.favorites = favorites;
        this.applyFolderFilter();
        this.favoritesService.getFavoriteFolders()
          .pipe(takeUntil(this.destroy$))
          .subscribe((folders: FavoriteFolder[]) => {
            this.favoriteFolders = folders;
          });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectFolder(folderPath: string): void {
    this.currentFolder = folderPath;
    this.applyFolderFilter();
  }

  applyFolderFilter(): void {
    if (this.currentFolder === '') {
      this.filteredFavorites = this.favorites;
    } else {
      this.filteredFavorites = this.favorites.filter(fav =>
        fav.folderPath.startsWith(this.currentFolder)
      );
    }
  }

  getProductsInFolder(folder: FavoriteFolder): ClientProduct[] {
    return this.favorites
      .filter(fav => fav.folderPath.startsWith(folder.path) && fav.product)
      .map(fav => fav.product as ClientProduct);
  }
}
