import { Injectable, signal } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, BehaviorSubject, of } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../modules/admin/interfaces/user.interface';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
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

    // Limpiar sesión al cerrar el navegador si no se quiere recordar
    window.addEventListener('beforeunload', () => {
      if (sessionStorage.getItem('clearSessionOnClose') === 'true') {
        // Limpiar tokens de Supabase del localStorage
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.includes('supabase') || key.includes('auth-token')) {
            localStorage.removeItem(key);
          }
        });
        sessionStorage.removeItem('clearSessionOnClose');
      }
    });
  }

  login(email: string, password: string, rememberMe: boolean = false): Observable<AuthUser> {
    return from(
      this.supabase.auth.signInWithPassword({
        email,
        password
      })
    ).pipe(
      switchMap(response => {
        if (response.error) throw response.error;
        if (!response.data.user) throw new Error('No se pudo autenticar');
        
        this.accessToken = response.data.session?.access_token || null;
        
        // Si no se quiere recordar, la sesión se eliminará al cerrar el navegador
        // Supabase usa localStorage por defecto, pero podemos limpiar al cerrar si rememberMe es false
        if (!rememberMe && response.data.session) {
          // Guardar flag para limpiar sesión al cerrar
          sessionStorage.setItem('clearSessionOnClose', 'true');
        } else {
          sessionStorage.removeItem('clearSessionOnClose');
        }
        
        // Esperar a que se cargue el usuario completo desde la BD
        return this.loadUserWithRole(response.data.user.id).pipe(
          map(authUser => {
            // Si hay avatar en user_metadata de Google, usarlo
            const metadata = response.data.user.user_metadata || {};
            const googleAvatar = metadata['avatar_url'] || metadata['picture'];
            const finalAuthUser = {
              ...authUser,
              avatar: authUser.avatar || googleAvatar
            };
            this.currentUserSubject.next(finalAuthUser);
            return finalAuthUser;
          })
        );
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
      switchMap(response => {
        if (response.error) throw response.error;
        if (!response.data.user) throw new Error('No se pudo registrar');
        
        this.accessToken = response.data.session?.access_token || null;
        
        // Crear usuario en la tabla users
        return this.createUserInDatabase(response.data.user.id, email, name).pipe(
          map(() => {
            this.setCurrentUser(response.data.user);
            return this.mapToAuthUser(response.data.user);
          })
        );
      })
    );
  }

  signInWithGoogle(): Observable<void> {
    return from(
      this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: false
        }
      })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        // La redirección será manejada automáticamente por Supabase
      })
    );
  }

  handleAuthCallback(): Observable<AuthUser | null> {
    return from(this.supabase.auth.getSession()).pipe(
      switchMap(({ data: { session }, error }) => {
        if (error) throw error;
        if (!session?.user) return of(null);
        
        this.accessToken = session.access_token || null;
        this.setCurrentUser(session.user);
        return of(this.mapToAuthUser(session.user));
      })
    );
  }

  private createUserInDatabase(userId: string, email: string, name: string, avatar?: string): Observable<void> {
    return from(
      this.supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          name: name,
          role: 'Usuario',
          status: 'Activo',
          avatar: avatar || null
        })
    ).pipe(
      map(response => {
        if (response.error && !response.error.message?.includes('duplicate')) {
          console.error('Error creando usuario en BD:', response.error);
        }
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
      this.getUserFromDatabase(authUser.id).subscribe({
        next: (dbUser) => {
          if (dbUser) {
            this.currentUserSubject.next({
              ...authUser,
              name: dbUser.name,
              role: dbUser.role,
              avatar: dbUser.avatar || authUser.avatar
            });
          } else {
            // Si no existe en la tabla users, crearlo (para usuarios de Google)
            const name = user.user_metadata?.name || user.user_metadata?.full_name || authUser.name || 'Usuario';
            const avatar = user.user_metadata?.['avatar_url'] || user.user_metadata?.['picture'] || authUser.avatar;
            
            this.createUserInDatabase(authUser.id, authUser.email, name, avatar).subscribe({
              next: () => {
                this.getUserFromDatabase(authUser.id).subscribe(createdUser => {
                  if (createdUser) {
                    this.currentUserSubject.next({
                      ...authUser,
                      name: createdUser.name,
                      role: createdUser.role,
                      avatar: createdUser.avatar || avatar
                    });
                  }
                });
              }
            });
          }
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
        if (!response.data) return null;
        
        // El id en Supabase es UUID (string), pero User interface espera number
        // Convertimos el UUID a un número hash para compatibilidad
        const idHash = response.data.id.split('-').join('').substring(0, 15);
        const numericId = parseInt(idHash, 16) || 0;
        
        return {
          id: numericId,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role as 'Administrador' | 'Usuario',
          status: response.data.status as 'Activo' | 'Inactivo',
          lastAccess: response.data.last_access,
          avatar: response.data.avatar,
          createdAt: response.data.created_at ? new Date(response.data.created_at) : undefined,
          updatedAt: response.data.updated_at ? new Date(response.data.updated_at) : undefined
        };
      })
    );
  }

  private loadUserWithRole(userId: string): Observable<AuthUser> {
    return from(
      this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
    ).pipe(
      map(response => {
        if (response.error || !response.data) {
          // Si no existe en la BD, retornar usuario básico
          return {
            id: userId,
            email: '',
            name: 'Usuario',
            role: 'Usuario'
          };
        }
        
        return {
          id: response.data.id, // UUID como string
          email: response.data.email,
          name: response.data.name,
          role: response.data.role as string,
          avatar: response.data.avatar || undefined
        };
      })
    );
  }

  private mapToAuthUser(user: any): AuthUser {
    const metadata = user.user_metadata || {};
    return {
      id: user.id,
      email: user.email,
      name: metadata['name'] || metadata['full_name'] || user.email?.split('@')[0],
      role: metadata['role'],
      avatar: metadata['avatar_url'] || metadata['picture']
    };
  }
}
