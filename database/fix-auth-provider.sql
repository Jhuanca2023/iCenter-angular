-- ============================================
-- AGREGAR COLUMNA auth_provider Y CAMPOS ADICIONALES
-- ============================================
-- Este script agrega la columna auth_provider y otros campos necesarios
-- Ejecutar en Supabase SQL Editor

-- Agregar campo auth_provider
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email' CHECK (auth_provider IN ('email', 'google'));

-- Agregar campos adicionales del perfil si no existen
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS city TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS country TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS postal_code TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name TEXT;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Actualizar usuarios existentes que tienen avatar de Google
UPDATE users 
SET auth_provider = 'google' 
WHERE avatar LIKE '%googleusercontent.com%' OR avatar LIKE '%google%';

-- Crear índice para auth_provider
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);

-- Verificar que las columnas se crearon correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'users' 
AND column_name IN ('auth_provider', 'phone', 'address', 'city', 'country', 'postal_code', 'first_name', 'last_name')
ORDER BY column_name;
