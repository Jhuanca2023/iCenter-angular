import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../config/supabase.config';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Banner, Promotion } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class BannersService {
    private supabase: SupabaseClient = getSupabaseClient();

    // Banners Methods
    getBanners(): Observable<Banner[]> {
        return from(
            this.supabase
                .from('banners')
                .select('*')
                .eq('is_active', true)
                .order('order_index', { ascending: true })
        ).pipe(
            map(response => {
                if (response.error) throw response.error;
                return response.data || [];
            })
        );
    }

    getAllAdmin(): Observable<Banner[]> {
        return from(
            this.supabase
                .from('banners')
                .select('*')
                .order('order_index', { ascending: true })
        ).pipe(
            map(response => {
                if (response.error) throw response.error;
                return response.data || [];
            })
        );
    }

    create(banner: Partial<Banner>): Observable<Banner> {
        return from(
            this.supabase
                .from('banners')
                .insert(banner)
                .select()
                .single()
        ).pipe(
            map(response => {
                if (response.error) throw response.error;
                return response.data;
            })
        );
    }

    update(id: string, banner: Partial<Banner>): Observable<Banner> {
        return from(
            this.supabase
                .from('banners')
                .update(banner)
                .eq('id', id)
                .select()
                .single()
        ).pipe(
            map(response => {
                if (response.error) throw response.error;
                return response.data;
            })
        );
    }

    delete(id: string): Observable<void> {
        return from(
            this.supabase
                .from('banners')
                .delete()
                .eq('id', id)
        ).pipe(
            map(response => {
                if (response.error) throw response.error;
            })
        );
    }

    // Promotions Methods
    getPromotions(): Observable<Promotion[]> {
        return from(
            this.supabase
                .from('promotions')
                .select('*')
                .eq('is_active', true)
        ).pipe(
            map(response => {
                if (response.error) throw response.error;
                return response.data || [];
            })
        );
    }

    getAllPromotionsAdmin(): Observable<Promotion[]> {
        return from(
            this.supabase
                .from('promotions')
                .select('*')
        ).pipe(
            map(response => {
                if (response.error) throw response.error;
                return response.data || [];
            })
        );
    }

    createPromotion(promo: Partial<Promotion>): Observable<Promotion> {
        return from(
            this.supabase
                .from('promotions')
                .insert(promo)
                .select()
                .single()
        ).pipe(
            map(response => {
                if (response.error) throw response.error;
                return response.data;
            })
        );
    }

    updatePromotion(id: string, promo: Partial<Promotion>): Observable<Promotion> {
        return from(
            this.supabase
                .from('promotions')
                .update(promo)
                .eq('id', id)
                .select()
                .single()
        ).pipe(
            map(response => {
                if (response.error) throw response.error;
                return response.data;
            })
        );
    }

    deletePromotion(id: string): Observable<void> {
        return from(
            this.supabase
                .from('promotions')
                .delete()
                .eq('id', id)
        ).pipe(
            map(response => {
                if (response.error) throw response.error;
            })
        );
    }
}
