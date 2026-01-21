-- ============================================
-- SOLUCIÓN FINAL - QUITAR RESTRICCIONES NOT NULL
-- Ejecuta esto en el SQL Editor de Supabase
-- ============================================

-- Hacer que product_service_involved sea OPCIONAL (puede ser NULL)
ALTER TABLE claims ALTER COLUMN product_service_involved DROP NOT NULL;

-- Por si hay otras columnas problemáticas, las hacemos opcionales también
ALTER TABLE claims ALTER COLUMN consumer_name DROP NOT NULL;
ALTER TABLE claims ALTER COLUMN consumer_lastname DROP NOT NULL;
ALTER TABLE claims ALTER COLUMN document_type DROP NOT NULL;
ALTER TABLE claims ALTER COLUMN document_number DROP NOT NULL;
ALTER TABLE claims ALTER COLUMN email DROP NOT NULL;
ALTER TABLE claims ALTER COLUMN phone DROP NOT NULL;
ALTER TABLE claims ALTER COLUMN record_type DROP NOT NULL;
ALTER TABLE claims ALTER COLUMN incident_date DROP NOT NULL;
ALTER TABLE claims ALTER COLUMN detailed_description DROP NOT NULL;
ALTER TABLE claims ALTER COLUMN customer_request DROP NOT NULL;

-- Agregar columnas faltantes si no existen
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_name TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_lastname TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_document_type TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_document_number TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_phone TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS guardian_email TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS claimant_type TEXT DEFAULT 'ADULT';
ALTER TABLE claims ADD COLUMN IF NOT EXISTS is_minor BOOLEAN DEFAULT FALSE;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS motive TEXT DEFAULT 'OTROS';
ALTER TABLE claims ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS receipt_number TEXT;

-- Forzar recarga del schema
NOTIFY pgrst, 'reload schema';

-- Mensaje de confirmación
SELECT 'TABLA CLAIMS ACTUALIZADA CORRECTAMENTE' AS resultado;
