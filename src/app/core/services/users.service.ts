import { Injectable } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../modules/admin/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private supabase: SupabaseClient = getSupabaseClient();

  getAll(): Observable<User[]> {
    return from(
      this.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToUsers(response.data || []);
      })
    );
  }

  getById(id: string): Observable<User | null> {
    return from(
      this.supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data ? this.mapToUser(response.data) : null;
      })
    );
  }

  create(user: Partial<User>): Observable<User> {
    const userData = {
      name: user.name,
      email: user.email,
      role: user.role || 'Usuario',
      status: user.status || 'Activo',
      avatar: user.avatar || null
    };

    return from(
      this.supabase
        .from('users')
        .insert(userData)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToUser(response.data);
      })
    );
  }

  update(id: string, user: Partial<User>): Observable<User> {
    const userData: any = {};
    if (user.name) userData.name = user.name;
    if (user.email) userData.email = user.email;
    if (user.role) userData.role = user.role;
    if (user.status) userData.status = user.status;
    if (user.avatar !== undefined) userData.avatar = user.avatar;

    return from(
      this.supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return this.mapToUser(response.data);
      })
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supabase
        .from('users')
        .delete()
        .eq('id', id)
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
      })
    );
  }

  private mapToUser(data: any): User {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      lastAccess: data.last_access ? new Date(data.last_access).toLocaleDateString('es-PE') : undefined,
      avatar: data.avatar,
      createdAt: data.created_at ? new Date(data.created_at) : undefined,
      updatedAt: data.updated_at ? new Date(data.updated_at) : undefined
    };
  }

  private mapToUsers(data: any[]): User[] {
    return data.map(item => this.mapToUser(item));
  }
}
