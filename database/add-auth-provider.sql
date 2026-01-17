-- Agregar campo auth_provider y campos adicionales a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email' CHECK (auth_provider IN ('email', 'google'));

-- Actualizar usuarios existentes que tienen avatar de Google
UPDATE users 
SET auth_provider = 'google' 
WHERE avatar LIKE '%googleusercontent.com%' OR avatar LIKE '%google%';

-- Crear índice para auth_provider
CREATE INDEX IF NOT EXISTS idx_users_auth_provider ON users(auth_provider);
