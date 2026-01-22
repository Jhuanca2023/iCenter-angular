-- ============================================
-- ARREGLAR TODAS LAS COLUMNAS FALTANTES EN CLAIMS
-- Ejecuta esto UNA SOLA VEZ en el SQL Editor de Supabase
-- ============================================

-- PASO 1: Agregar TODAS las columnas que podrían faltar
ALTER TABLE claims ADD COLUMN IF NOT EXISTS claim_code TEXT UNIQUE;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS consumer_name TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS consumer_lastname TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS document_type TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS document_number TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS claimant_type TEXT DEFAULT 'ADULT';
ALTER TABLE claims ADD COLUMN IF NOT EXISTS is_minor BOOLEAN DEFAULT FALSE;

-- Columnas del apoderado (guardian)
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_name TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_lastname TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_document_type TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_document_number TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_phone TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_email TEXT;

-- Detalles del reclamo
ALTER TABLE claims ADD COLUMN IF NOT EXISTS record_type TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS motive TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS incident_date DATE;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS detailed_description TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS customer_request TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS receipt_number TEXT;

-- Estado y metadata
ALTER TABLE claims ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDIENTE';
ALTER TABLE claims ADD COLUMN IF NOT EXISTS response_deadline TIMESTAMPTZ;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE claims ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE claims ADD COLUMN IF NOT EXISTS user_id UUID;

-- PASO 2: Forzar a PostgREST a recargar el schema
NOTIFY pgrst, 'reload schema';

-- PASO 3: Verificar que todo esté bien (OPCIONAL - solo para revisar)
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'claims' 
-- ORDER BY ordinal_position;
