import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseClient) {
    const supabaseUrl = environment.supabaseUrl;
    const supabaseAnonKey = environment.supabaseAnonKey;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('⚠️ Supabase URL o Anon Key no configurados. Usando valores vacíos.');
      supabaseClient = createClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key'
      );
    } else {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  
  return supabaseClient;
}
