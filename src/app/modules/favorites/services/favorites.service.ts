import { Injectable } from '@angular/core';
import { AuthUser } from '../../../core/services/auth.service';
import { getSupabaseClient } from '../../../core/config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, of, BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, tap, catchError } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';
import { ProductsService } from '../../../core/services/products.service';
import { ClientProduct } from '../../../core/interfaces/product.interface';
import { Favorite, FavoriteFolder } from '../interfaces/favorite.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private supabase: SupabaseClient = getSupabaseClient();
  private _favorites = new BehaviorSubject<Favorite[]>([]);
  public readonly favorites$ = this._favorites.asObservable();

  constructor(
    private authService: AuthService,
    private productsService: ProductsService
  ) {
    this.authService.currentUser$.subscribe((user: AuthUser | null) => {
      if (user) {
        this.loadFavorites(user.id);
      } else {
        this._favorites.next([]);
      }
    });
  }

  private async loadFavorites(userId: string): Promise<void> {
    const { data, error } = await this.supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error loading favorites:', error);
      this._favorites.next([]);
      return;
    }

    if (data) {
      const favoriteProductIds = data.map(fav => fav.product_id);
      if (favoriteProductIds.length > 0) {
        this.productsService.getProductsByIds(favoriteProductIds).subscribe(
          products => {
            const favoritesWithProducts: Favorite[] = data.map(fav => ({
              id: fav.id,
              productId: fav.product_id,
              userId: fav.user_id,
              folderPath: fav.folder_path || '',
              createdAt: fav.created_at,
              updatedAt: fav.updated_at,
              product: products.find(p => p.id === fav.product_id)
            }));
            this._favorites.next(favoritesWithProducts);
          },
          (error: any) => { // Explicitly type error
            console.error('Error fetching favorite product details:', error);
            this._favorites.next(data.map(fav => ({
              id: fav.id,
              productId: fav.product_id,
              userId: fav.user_id,
              folderPath: fav.folder_path || '',
              createdAt: fav.created_at,
              updatedAt: fav.updated_at,
              product: undefined
            })));
          }
        );
      } else {
        this._favorites.next([]);
      }
    }
  }

  addFavorite(productId: string, folderPath: string = ''): Observable<Favorite | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user: AuthUser | null) => {
        if (!user || !user.id) { // Check for user.id
          console.error('User not authenticated or user ID is missing.');
          return of(null);
        }
        const userId = user.id;
        return from(
          this.supabase
            .from('favorites')
            .insert({ user_id: userId, product_id: productId, folder_path: folderPath })
            .select('*')
            .single()
        ).pipe(
          switchMap(response => {
            if (response.error) throw response.error;
            const newFavorite = response.data as Favorite;
            return this.productsService.getProductByIdForClient(productId).pipe(
              map(product => {
                if (product) {
                  const favoriteWithProduct = { ...newFavorite, product };
                  const currentFavorites = this._favorites.getValue();
                  this._favorites.next([...currentFavorites, favoriteWithProduct]);
                  return favoriteWithProduct;
                }
                return newFavorite;
              })
            );
          }),
          catchError((error: any) => { // Explicitly type error
            console.error('Error adding favorite:', error);
            return of(null);
          })
        );
      })
    );
  }

  removeFavorite(favoriteId: string): Observable<boolean> {
    return from(
      this.supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        const currentFavorites = this._favorites.getValue();
        this._favorites.next(currentFavorites.filter(fav => fav.id !== favoriteId));
        return true;
      }),
      catchError((error: any) => { // Explicitly type error
        console.error('Error removing favorite:', error);
        return of(false);
      })
    );
  }

  isFavorite(productId: string): Observable<boolean> {
    return this.favorites$.pipe(
      map(favorites => favorites.some(fav => fav.productId === productId))
    );
  }

  getFavoriteFolders(): Observable<FavoriteFolder[]> {
    return this.favorites$.pipe(
      map(favorites => {
        const root: FavoriteFolder = { path: '', name: 'Todos los favoritos', productCount: favorites.length, subfolders: [] };
        const folderMap = new Map<string, FavoriteFolder>();
        folderMap.set('', root);

        favorites.forEach(fav => {
          if (fav.folderPath) {
            const pathParts = fav.folderPath.split('/');
            let currentPath = '';
            let parentFolder = root;

            pathParts.forEach(part => {
              const segmentPath = currentPath ? `${currentPath}/${part}` : part;
              if (!folderMap.has(segmentPath)) {
                const newFolder: FavoriteFolder = { path: segmentPath, name: part, productCount: 0, subfolders: [] };
                folderMap.set(segmentPath, newFolder);
                parentFolder.subfolders.push(newFolder);
              }
              parentFolder = folderMap.get(segmentPath)!;
              currentPath = segmentPath;
            });
          }
        });

        folderMap.forEach(folder => {
          folder.subfolders.sort((a, b) => a.name.localeCompare(b.name));
          folder.productCount = favorites.filter(fav => fav.folderPath.startsWith(folder.path)).length;
        });

        return root.subfolders;
      })
    );
  }
}