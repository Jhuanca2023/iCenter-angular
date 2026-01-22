-- ============================================
-- UPDATE CLAIMS SCHEMA - ADD MISSING COLUMNS
-- ============================================

-- Agregar columna claimant_type si no existe
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'claims' AND COLUMN_NAME = 'claimant_type') THEN
    ALTER TABLE claims ADD COLUMN claimant_type TEXT NOT NULL DEFAULT 'ADULT';
  END IF;
END $$;

-- Agregar columna motive si no existe
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'claims' AND COLUMN_NAME = 'motive') THEN
    ALTER TABLE claims ADD COLUMN motive TEXT NOT NULL DEFAULT 'OTROS';
  END IF;
END $$;

-- Asegurar que los demás campos existan (por si acaso)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'claims' AND COLUMN_NAME = 'is_minor') THEN
    ALTER TABLE claims ADD COLUMN is_minor BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Forzar refresco de la caché de PostgREST
NOTIFY pgrst, 'reload schema';
