-- Tabla para almacenar los reclamos y quejas
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_code TEXT UNIQUE NOT NULL, -- LR-2026-000123
  
  -- Step 1: Datos del consumidor
  consumer_name TEXT NOT NULL,
  consumer_lastname TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  claimant_type TEXT NOT NULL DEFAULT 'ADULT', -- ADULT, MINOR
  is_minor BOOLEAN DEFAULT FALSE,
  
  -- Datos apoderado (si es menor)
  guardian_name TEXT,
  guardian_lastname TEXT,
  guardian_document_type TEXT,
  guardian_document_number TEXT,
  guardian_phone TEXT,
  guardian_email TEXT,
  
  -- Step 2: Detalles del reclamo
  record_type TEXT NOT NULL, -- RECLAMO, QUEJA
  motive TEXT NOT NULL, -- ATENCIÓN AL CLIENTE, PRODUCTO O SERVICIO, SISTEMA TÉCNICO, OTROS
  incident_date DATE NOT NULL,
  detailed_description TEXT NOT NULL,
  customer_request TEXT NOT NULL, -- SOLUCIÓN ESPERADA
  order_number TEXT,
  receipt_number TEXT,
  
  -- Información del sistema
  status TEXT NOT NULL DEFAULT 'PENDIENTE', -- PENDIENTE, EN PROCESO, COMPLETADO, ARCHIVADO
  response_deadline TIMESTAMPTZ NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Tabla historial
CREATE TABLE IF NOT EXISTS claim_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  admin_response TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_history ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Claims visible to owner or admin" ON claims
  FOR SELECT USING (auth.uid() = user_id OR (SELECT role FROM users WHERE id = auth.uid()) = 'Administrador');

CREATE POLICY "Anyone can insert claims" ON claims
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update claims" ON claims
  FOR UPDATE USING ((SELECT role FROM users WHERE id = auth.uid()) = 'Administrador');
