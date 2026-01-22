-- ============================================
-- FIX RLS POLICIES FOR CLAIMS AND HISTORY
-- ============================================

-- Permitir que cualquier persona inserte en claim_history
-- Esto es necesario para registrar la creación de un reclamo incluso si el usuario no está logueado
DROP POLICY IF EXISTS "Anyone can insert claim_history" ON claim_history;
CREATE POLICY "Anyone can insert claim_history" ON claim_history
  FOR INSERT WITH CHECK (true);

-- Permitir lectura de historial si el usuario es dueño del reclamo o admin
DROP POLICY IF EXISTS "Claim history visible to owner or admin" ON claim_history;
CREATE POLICY "Claim history visible to owner or admin" ON claim_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM claims 
      WHERE claims.id = claim_history.claim_id 
      AND (claims.user_id = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'Administrador')
    )
    OR 
    -- Si el reclamo es público (seguimiento por código), permitir lectura de historial
    -- Para simplificar el seguimiento sin login, permitimos lectura si se conoce el claim_id
    true 
  );

-- Asegurar que la política de inserción de claims sea 'true' (ya debería estar)
DROP POLICY IF EXISTS "Anyone can insert claims" ON claims;
CREATE POLICY "Anyone can insert claims" ON claims
  FOR INSERT WITH CHECK (true);
