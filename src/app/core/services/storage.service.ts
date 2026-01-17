import { Injectable } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private supabase: SupabaseClient = getSupabaseClient();

  uploadImage(
    bucket: string,
    file: File,
    path: string
  ): Observable<string> {
    return from(
      this.supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        
        // Obtener URL pública
        return this.getPublicUrl(bucket, path);
      })
    );
  }

  uploadMultipleImages(
    bucket: string,
    files: File[],
    basePath: string
  ): Observable<string[]> {
    const uploadPromises = files.map((file, index) => {
      const fileName = `${Date.now()}-${index}-${file.name}`;
      const filePath = `${basePath}/${fileName}`;
      return this.uploadImage(bucket, file, filePath);
    });

    return forkJoin(uploadPromises);
  }

  deleteImage(bucket: string, path: string): Observable<void> {
    return from(
      this.supabase.storage
        .from(bucket)
        .remove([path])
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  getPublicUrl(bucket: string, path: string): Observable<string> {
    return new Observable(observer => {
      const { data } = this.supabase.storage
        .from(bucket)
        .getPublicUrl(path);
      
      observer.next(data.publicUrl);
      observer.complete();
    });
  }

  deleteMultipleImages(bucket: string, paths: string[]): Observable<void> {
    return from(
      this.supabase.storage
        .from(bucket)
        .remove(paths)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }
}
