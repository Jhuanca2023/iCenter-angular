import { Injectable } from '@angular/core';
import { getSupabaseClient } from '../config/supabase.config';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Claim, ClaimHistory } from '../models/claim.model';

@Injectable({
  providedIn: 'root'
})
export class ClaimsService {
  private supabase: SupabaseClient = getSupabaseClient();

  constructor() { }

  /**
   * Genera un código de reclamo único en el formato LR-YYYY-XXXXXX.
   * @returns Observable<string> El código de reclamo generado.
   */
  private generateClaimCode(): Observable<string> {
    const year = new Date().getFullYear();
    // Supabase tiene una función para generar secuencias, pero para simplificar,
    // generaremos un número aleatorio y verificaremos su unicidad.
    // En un entorno de producción, se preferiría una secuencia de base de datos.
    return from(this.supabase.from('claims').select('id', { count: 'exact' })).pipe(
      map(response => {
        if (response.error) throw response.error;
        const count = response.count || 0;
        const nextNumber = count + 1;
        const paddedNumber = String(nextNumber).padStart(6, '0');
        return `LR-${year}-${paddedNumber}`;
      }),
      catchError(error => {
        console.error('Error generating claim code:', error);
        return throwError(() => new Error('Could not generate claim code.'));
      })
    );
  }

  private calculateBusinessDays(startDate: Date, days: number): Date {
    let currentDate = new Date(startDate.getTime());
    let businessDaysCount = 0;

    while (businessDaysCount < days) {
      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // If it's not a Sunday or Saturday
        businessDaysCount++;
      }
    }
    return currentDate;
  }

  /**
   * Crea un nuevo reclamo en la base de datos.
   * @param claimData Los datos del reclamo a crear.
   * @returns Observable<Claim> El reclamo creado con su ID y código.
   */
  createClaim(claimData: Omit<Claim, 'id' | 'claim_code' | 'status' | 'response_deadline' | 'created_at' | 'updated_at'>): Observable<Claim> {
    return this.generateClaimCode().pipe(
      switchMap(claimCode => {
        const createdAt = new Date();
        const responseDeadline = this.calculateBusinessDays(createdAt, 15); // 15 días hábiles de plazo

        const newClaim: Omit<Claim, 'id' | 'updated_at'> = {
          ...claimData,
          claim_code: claimCode,
          status: 'PENDIENTE',
          response_deadline: responseDeadline.toISOString(),
          created_at: createdAt.toISOString(),
        };

        return from(
          this.supabase
            .from('claims')
            .insert(newClaim as any) // Casteo a 'any' para evitar problemas con 'id' que es opcional
            .select()
            .single()
        ).pipe(
          map(response => {
            if (response.error) throw response.error;
            return response.data as Claim;
          }),
          switchMap(createdClaim => {
            // Registrar la creación del reclamo en el historial
            const historyEntry: Omit<ClaimHistory, 'id' | 'created_at'> = {
              claim_id: createdClaim.id!,
              action_type: 'CLAIM_CREATED',
              new_status: 'REGISTRADO',
              created_by: createdClaim.user_id // Si el usuario está logueado
            };
            return from(this.supabase.from('claim_history').insert(historyEntry)).pipe(
              map(() => createdClaim) // Devolver el reclamo creado
            );
          }),
          catchError(error => {
            console.error('Error creating claim:', error);
            return throwError(() => new Error('Could not create claim.'));
          })
        );
      })
    );
  }

  /**
   * Obtiene un reclamo por su código y un identificador (documento o email).
   * @param claimCode El código único del reclamo.
   * @param identifier El número de documento o correo electrónico del consumidor.
   * @returns Observable<Claim | null> El reclamo encontrado o null si no existe o no coincide el identificador.
   */
  getClaimByCodeAndIdentifier(claimCode: string, identifier: string): Observable<Claim | null> {
    return from(
      this.supabase
        .from('claims')
        .select('*')
        .eq('claim_code', claimCode)
        .or(`document_number.eq.${identifier},email.eq.${identifier}`)
        .single()
    ).pipe(
      map(response => {
        if (response.error && response.error.code !== 'PGRST116') { // PGRST116 = no rows found
          throw response.error;
        }
        return response.data as Claim | null;
      }),
      catchError(error => {
        console.error('Error fetching claim by code and identifier:', error);
        return throwError(() => new Error('Could not retrieve claim.'));
      })
    );
  }

  /**
   * Obtiene el historial de un reclamo específico.
   * @param claimId El ID del reclamo.
   * @returns Observable<ClaimHistory[]> El historial del reclamo.
   */
  getClaimHistory(claimId: string): Observable<ClaimHistory[]> {
    return from(
      this.supabase
        .from('claim_history')
        .select('*')
        .eq('claim_id', claimId)
        .order('created_at', { ascending: true })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data as ClaimHistory[];
      }),
      catchError(error => {
        console.error('Error fetching claim history:', error);
        return throwError(() => new Error('Could not retrieve claim history.'));
      })
    );
  }

  /**
   * Obtiene todos los reclamos (para el administrador).
   * @returns Observable<Claim[]> Una lista de todos los reclamos.
   */
  getAllClaims(): Observable<Claim[]> {
    return from(
      this.supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false })
    ).pipe(
      map(response => {
        if (response.error) throw response.error;
        return response.data as Claim[];
      }),
      catchError(error => {
        console.error('Error fetching all claims:', error);
        return throwError(() => new Error('Could not retrieve all claims.'));
      })
    );
  }

  /**
   * Obtiene un reclamo por su ID (para el administrador).
   * @param id El ID del reclamo.
   * @returns Observable<Claim | null> El reclamo encontrado o null.
   */
  getClaimById(id: string): Observable<Claim | null> {
    return from(
      this.supabase
        .from('claims')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(response => {
        if (response.error && response.error.code !== 'PGRST116') { // PGRST116 = no rows found
          throw response.error;
        }
        return response.data as Claim | null;
      }),
      catchError(error => {
        console.error('Error fetching claim by ID:', error);
        return throwError(() => new Error('Could not retrieve claim by ID.'));
      })
    );
  }

  /**
   * Actualiza el estado de un reclamo y registra el cambio en el historial.
   * @param claimId El ID del reclamo a actualizar.
   * @param newStatus El nuevo estado del reclamo.
   * @param adminId El ID del administrador que realiza la acción (opcional).
   * @returns Observable<Claim> El reclamo actualizado.
   */
  updateClaimStatus(claimId: string, newStatus: Claim['status'], adminId?: string): Observable<Claim> {
    return from(this.getClaimById(claimId)).pipe(
      switchMap(existingClaim => {
        if (!existingClaim) {
          return throwError(() => new Error('Claim not found.'));
        }

        const oldStatus = existingClaim.status;
        if (oldStatus === newStatus) {
          return from([existingClaim]); // No hay cambio de estado
        }

        return from(
          this.supabase
            .from('claims')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', claimId)
            .select()
            .single()
        ).pipe(
          switchMap(response => {
            if (response.error) throw response.error;
            const updatedClaim = response.data as Claim;

            // Registrar el cambio de estado en el historial
            const historyEntry: Omit<ClaimHistory, 'id' | 'created_at'> = {
              claim_id: claimId,
              action_type: 'STATUS_CHANGE',
              old_status: oldStatus,
              new_status: newStatus,
              created_by: adminId
            };
            return from(this.supabase.from('claim_history').insert(historyEntry)).pipe(
              map(() => updatedClaim)
            );
          }),
          catchError(error => {
            console.error('Error updating claim status:', error);
            return throwError(() => new Error('Could not update claim status.'));
          })
        );
      })
    );
  }

  /**
   * Añade una respuesta del administrador a un reclamo y actualiza su estado a 'RESPONDIDO'.
   * @param claimId El ID del reclamo.
   * @param response La respuesta del administrador.
   * @param adminId El ID del administrador que responde.
   * @returns Observable<Claim> El reclamo actualizado.
   */
  addAdminResponse(claimId: string, response: string, adminId: string): Observable<Claim> {
    return from(this.getClaimById(claimId)).pipe(
      switchMap(existingClaim => {
        if (!existingClaim) {
          return throwError(() => new Error('Claim not found.'));
        }

        const oldStatus = existingClaim.status;
        const newStatus: Claim['status'] = 'COMPLETADO';

        return from(
          this.supabase
            .from('claims')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', claimId)
            .select()
            .single()
        ).pipe(
          switchMap(updateResponse => {
            if (updateResponse.error) throw updateResponse.error;
            const updatedClaim = updateResponse.data as Claim;

            // Registrar la respuesta y el cambio de estado en el historial
            const historyEntry: Omit<ClaimHistory, 'id' | 'created_at'> = {
              claim_id: claimId,
              action_type: 'ADMIN_RESPONSE',
              old_status: oldStatus,
              new_status: newStatus,
              admin_response: response,
              created_by: adminId
            };
            return from(this.supabase.from('claim_history').insert(historyEntry)).pipe(
              map(() => updatedClaim)
            );
          }),
          catchError(error => {
            console.error('Error adding admin response:', error);
            return throwError(() => new Error('Could not add admin response.'));
          })
        );
      })
    );
  }
}
