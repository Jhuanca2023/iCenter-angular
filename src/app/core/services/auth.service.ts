import { Injectable, signal } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, BehaviorSubject, of } from 'rxjs';
import { map, tap, switchMap, catchError } from 'rxjs/operators';
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
        
        // Actualizar último acceso y esperar a que se cargue el usuario completo desde la BD
        return this.updateLastAccess(response.data.user.id).pipe(
          switchMap(() => this.loadUserWithRole(response.data.user.id)),
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
        
        const user = response.data.user;
        this.accessToken = response.data.session?.access_token || null;
        
        // Crear usuario en la tabla users
        return this.createUserInDatabase(user.id, email, name, undefined, 'email').pipe(
          switchMap(() => this.loadUserWithRole(user.id)),
          map(authUser => {
            this.currentUserSubject.next(authUser);
            return authUser;
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
        
        // Detectar si es Google y guardar datos automáticamente
        const isGoogle = session.user.app_metadata?.['provider'] === 'google' || 
                        session.user.user_metadata?.['provider'] === 'google' ||
                        session.user.identities?.some((id: any) => id['provider'] === 'google');
        
        if (isGoogle) {
          const metadata = session.user.user_metadata || {};
          // Obtener nombre completo de Google (puede estar en diferentes campos)
          const googleName = metadata['name'] || 
                            metadata['full_name'] || 
                            (metadata['given_name'] && metadata['family_name'] ? `${metadata['given_name']} ${metadata['family_name']}` : null) ||
                            metadata['given_name'] ||
                            session.user.email?.split('@')[0] || 
                            'Usuario';
          const googleAvatar = metadata['avatar_url'] || metadata['picture'];
          const googleEmail = session.user.email || '';
          
          console.log('Datos de Google detectados:', { googleName, googleEmail, googleAvatar, metadata });
          
          // Crear o actualizar usuario con datos de Google y actualizar último acceso
          return this.createOrUpdateGoogleUser(session.user.id, googleEmail, googleName, googleAvatar).pipe(
            switchMap(() => this.updateLastAccess(session.user.id)),
            switchMap(() => this.loadUserWithRole(session.user.id)),
            map(authUser => {
              console.log('Usuario cargado después de Google:', authUser);
              this.currentUserSubject.next(authUser);
              return authUser;
            })
          );
        } else {
          this.setCurrentUser(session.user);
          return of(this.mapToAuthUser(session.user));
        }
      })
    );
  }

  private createUserInDatabase(userId: string, email: string, name: string, avatar?: string, authProvider: 'email' | 'google' = 'email'): Observable<void> {
    return from(
      this.supabase
        .from('users')
        .insert({
          id: userId,
          email: email,
          name: name,
          role: 'Usuario',
          status: 'Activo',
          avatar: avatar || null,
          auth_provider: authProvider
        })
    ).pipe(
      map(response => {
        if (response.error) {
          // Si el error es de duplicado, ignorarlo (ya existe)
          if (response.error.code === '23505' || response.error.message?.includes('duplicate')) {
            console.log('Usuario ya existe en BD, continuando...');
            return;
          }
          console.error('Error creando usuario en BD:', response.error);
        }
      }),
      catchError(err => {
        // Si es error de duplicado, ignorar
        if (err.code === '23505' || err.message?.includes('duplicate')) {
          console.log('Usuario ya existe, continuando...');
          return of(undefined);
        }
        console.error('Error en createUserInDatabase:', err);
        return of(undefined);
      })
    );
  }

  private createOrUpdateGoogleUser(userId: string, email: string, name: string, avatar?: string): Observable<void> {
    console.log('🔵 createOrUpdateGoogleUser llamado:', { userId, email, name, avatar });
    
    // Dividir nombre completo en first_name y last_name si es posible
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || null;
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null;
    
    // Primero verificar si el usuario existe
    return from(
      this.supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .maybeSingle()
    ).pipe(
      switchMap(response => {
        if (response.error) {
          if (response.error.code === 'PGRST116') {
            // Usuario no encontrado, es normal
            console.log('✅ Usuario no existe en BD, se creará nuevo registro');
          } else {
            console.error('❌ Error verificando usuario:', response.error);
          }
        }

        if (response.data) {
          // Usuario existe, actualizar solo campos necesarios
          const updateData: any = {
            email: email,
            name: name || 'Usuario',
            auth_provider: 'google',
            last_access: new Date().toISOString()
          };
          
          // Solo agregar campos si tienen valor
          if (firstName && firstName.trim()) updateData.first_name = firstName.trim();
          if (lastName && lastName.trim()) updateData.last_name = lastName.trim();
          if (avatar && avatar.trim()) updateData.avatar = avatar.trim();
          
          console.log('🔄 Actualizando usuario de Google existente:', updateData);
          
          return from(
            this.supabase
              .from('users')
              .update(updateData)
              .eq('id', userId)
              .select()
          );
        } else {
          // Usuario no existe, crear
          const insertData: any = {
            id: userId,
            email: email,
            name: name || 'Usuario',
            role: 'Usuario',
            status: 'Activo',
            auth_provider: 'google',
            last_access: new Date().toISOString()
          };
          
          // Solo agregar campos si tienen valor
          if (firstName && firstName.trim()) insertData.first_name = firstName.trim();
          if (lastName && lastName.trim()) insertData.last_name = lastName.trim();
          if (avatar && avatar.trim()) insertData.avatar = avatar.trim();
          
          console.log('➕ Insertando nuevo usuario de Google:', insertData);
          
          return from(
            this.supabase
              .from('users')
              .insert(insertData)
              .select()
          );
        }
      }),
      map(response => {
        if (response.error) {
          // Si el error es de duplicado, ignorarlo (ya existe)
          if (response.error.code === '23505' || response.error.message?.includes('duplicate')) {
            console.log('⚠️ Usuario ya existe (duplicado), continuando...');
            return;
          }
          console.error('❌ Error creando/actualizando usuario de Google en BD:', response.error);
          console.error('📋 Detalles del error:', JSON.stringify(response.error, null, 2));
          console.error('🔍 Código de error:', response.error.code);
          console.error('📝 Mensaje:', response.error.message);
          console.error('📊 Detalles completos:', response.error);
          throw response.error; // Lanzar error para que se pueda manejar mejor
        } else {
          if (response.data && response.data.length > 0) {
            console.log('✅ Usuario de Google guardado/actualizado correctamente:', response.data[0]);
          } else {
            console.log('✅ Operación completada (sin datos de retorno)');
          }
        }
      }),
      // Capturar cualquier error pero loguearlo mejor
      catchError(err => {
        console.error('❌ Error en createOrUpdateGoogleUser:', err);
        console.error('📋 Stack trace:', err.stack);
        // Retornar observable vacío para no bloquear el flujo de autenticación
        return of(undefined);
      })
    );
  }

  private updateLastAccess(userId: string): Observable<void> {
    return from(
      this.supabase
        .from('users')
        .update({ last_access: new Date().toISOString() })
        .eq('id', userId)
    ).pipe(
      map(response => {
        if (response.error) {
          // No lanzar error, solo loguear
          console.warn('Error actualizando último acceso:', response.error);
        }
      }),
      catchError(err => {
        console.warn('Error en updateLastAccess:', err);
        return of(undefined);
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

  // Método para verificar sesión de forma asíncrona (para guards)
  checkSessionAsync(): Observable<boolean> {
    return from(this.supabase.auth.getSession()).pipe(
      switchMap(({ data: { session }, error }) => {
        if (error || !session?.user) {
          this.accessToken = null;
          this.currentUserSubject.next(null);
          return of(false);
        }
        
        this.accessToken = session.access_token || null;
        
        // Cargar usuario completo desde BD
        return this.loadUserWithRole(session.user.id).pipe(
          map(authUser => {
            // Si es Google, asegurar que los datos estén guardados
            const isGoogle = session.user.app_metadata?.['provider'] === 'google' || 
                            session.user.user_metadata?.['provider'] === 'google' ||
                            session.user.identities?.some((id: any) => id['provider'] === 'google');
            
            if (isGoogle) {
              const metadata = session.user.user_metadata || {};
              const googleName = metadata['name'] || metadata['full_name'] || session.user.email?.split('@')[0] || 'Usuario';
              const googleAvatar = metadata['avatar_url'] || metadata['picture'];
              const googleEmail = session.user.email || '';
              
              // Actualizar en segundo plano sin bloquear
              this.createOrUpdateGoogleUser(session.user.id, googleEmail, googleName, googleAvatar).subscribe({
                next: () => {
                  this.loadUserWithRole(session.user.id).subscribe(updatedUser => {
                    this.currentUserSubject.next(updatedUser);
                  });
                }
              });
            }
            
            this.currentUserSubject.next(authUser);
            return true;
          })
        );
      })
    );
  }

  checkSession(): void {
    this.supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        this.accessToken = session.access_token || null;
        // Cargar usuario completo desde BD antes de establecerlo
        this.loadUserWithRole(session.user.id).subscribe({
          next: (authUser) => {
            // Si es Google, asegurar que los datos estén guardados
            const isGoogle = session.user.app_metadata?.['provider'] === 'google' || 
                            session.user.user_metadata?.['provider'] === 'google' ||
                            session.user.identities?.some((id: any) => id['provider'] === 'google');
            
            if (isGoogle) {
              const metadata = session.user.user_metadata || {};
              const googleName = metadata['name'] || metadata['full_name'] || session.user.email?.split('@')[0] || 'Usuario';
              const googleAvatar = metadata['avatar_url'] || metadata['picture'];
              const googleEmail = session.user.email || '';
              
              this.createOrUpdateGoogleUser(session.user.id, googleEmail, googleName, googleAvatar).subscribe({
                next: () => {
                  this.loadUserWithRole(session.user.id).subscribe(updatedUser => {
                    this.currentUserSubject.next(updatedUser);
                  });
                }
              });
            } else {
              this.currentUserSubject.next(authUser);
            }
          },
          error: () => {
            // Si falla, usar datos básicos del session
            this.setCurrentUser(session.user);
          }
        });
      } else {
        this.accessToken = null;
        this.currentUserSubject.next(null);
      }
    });
  }

  private setCurrentUser(user: any): void {
    const authUser = this.mapToAuthUser(user);
    
    // Detectar si es Google
    const isGoogle = user.app_metadata?.['provider'] === 'google' || 
                    user.user_metadata?.['provider'] === 'google' ||
                    user.identities?.some((id: any) => id['provider'] === 'google');
    
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
            // Si no existe en la tabla users, crearlo
            const name = user.user_metadata?.name || user.user_metadata?.full_name || authUser.name || 'Usuario';
            const avatar = user.user_metadata?.['avatar_url'] || user.user_metadata?.['picture'] || authUser.avatar;
            const provider = isGoogle ? 'google' : 'email';
            
            this.createUserInDatabase(authUser.id, authUser.email, name, avatar, provider).subscribe({
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
    } else {
      this.currentUserSubject.next(authUser);
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
      switchMap(response => {
        if (response.error || !response.data) {
          // Si no existe en la BD, intentar obtener datos de la sesión actual de Supabase
          return from(this.supabase.auth.getUser()).pipe(
            map(userResponse => {
              if (userResponse.data?.user && userResponse.data.user.id === userId) {
                const metadata = userResponse.data.user.user_metadata || {};
                const name = metadata['name'] || metadata['full_name'] || userResponse.data.user.email?.split('@')[0] || 'Usuario';
                const avatar = metadata['avatar_url'] || metadata['picture'];
                return {
                  id: userId,
                  email: userResponse.data.user.email || '',
                  name: name,
                  role: 'Usuario',
                  avatar: avatar
                };
              }
              return {
                id: userId,
                email: '',
                name: 'Usuario',
                role: 'Usuario'
              };
            })
          );
        }
        
        return of({
          id: response.data.id, // UUID como string
          email: response.data.email || '',
          name: response.data.name || 'Usuario',
          role: response.data.role as string || 'Usuario',
          avatar: response.data.avatar || undefined
        });
      })
    );
  }

  private mapToAuthUser(user: any): AuthUser {
    const metadata = user.user_metadata || {};
    // Priorizar nombre completo de Google
    const name = metadata['name'] || metadata['full_name'] || user.email?.split('@')[0] || 'Usuario';
    const avatar = metadata['avatar_url'] || metadata['picture'];
    
    return {
      id: user.id,
      email: user.email || '',
      name: name,
      role: metadata['role'] || 'Usuario',
      avatar: avatar
    };
  }
}
