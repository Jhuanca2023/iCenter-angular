import { Injectable, signal } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../modules/admin/interfaces/user.interface';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient = getSupabaseClient();
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private accessToken: string | null = null;

  constructor(private router: Router) {
    this.checkSession();
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        this.accessToken = session.access_token || null;
        this.setCurrentUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.accessToken = null;
        this.currentUserSubject.next(null);
      }
    });
  }

  login(email: string, password: string): Observable<AuthUser> {
    return from(
      this.supabase.auth.signInWithPassword({
        email,
        password
      })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        if (!response.data.user) throw new Error('No se pudo autenticar');
        
        this.accessToken = response.data.session?.access_token || null;
        this.setCurrentUser(response.data.user);
        return this.mapToAuthUser(response.data.user);
      })
    );
  }

  register(email: string, password: string, name: string): Observable<AuthUser> {
    return from(
      this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        if (!response.data.user) throw new Error('No se pudo registrar');
        
        this.accessToken = response.data.session?.access_token || null;
        this.setCurrentUser(response.data.user);
        return this.mapToAuthUser(response.data.user);
      })
    );
  }

  logout(): Observable<void> {
    return from(this.supabase.auth.signOut()).pipe(
      tap(() => {
        this.accessToken = null;
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth']);
      }),
      map(() => undefined)
    );
  }

  getCurrentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  token(): string | null {
    return this.accessToken;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'Administrador' || false;
  }

  checkSession(): void {
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        this.accessToken = session.access_token || null;
        this.setCurrentUser(session.user);
      } else {
        this.accessToken = null;
      }
    });
  }

  private setCurrentUser(user: any): void {
    const authUser = this.mapToAuthUser(user);
    this.currentUserSubject.next(authUser);
    
    // Obtener datos adicionales del usuario desde la tabla users
    if (authUser.id) {
      this.getUserFromDatabase(authUser.id).subscribe(dbUser => {
        if (dbUser) {
          this.currentUserSubject.next({
            ...authUser,
            name: dbUser.name,
            role: dbUser.role
          });
        }
      });
    }
  }

  private getUserFromDatabase(userId: string): Observable<User | null> {
    return from(
      this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error) return null;
        return response.data ? {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role as 'Administrador' | 'Usuario',
          status: response.data.status as 'Activo' | 'Inactivo',
          lastAccess: response.data.last_access,
          avatar: response.data.avatar,
          createdAt: response.data.created_at ? new Date(response.data.created_at) : undefined,
          updatedAt: response.data.updated_at ? new Date(response.data.updated_at) : undefined
        } : null;
      })
    );
  }

  private mapToAuthUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email?.split('@')[0],
      role: user.user_metadata?.role
    };
  }
}
