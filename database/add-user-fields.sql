-- Agregar campos adicionales a la tabla users para perfil del cliente
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Perú',
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS is_google_account BOOLEAN DEFAULT false;

-- Actualizar usuarios existentes que tienen name completo
UPDATE users 
SET first_name = SPLIT_PART(name, ' ', 1),
    last_name = CASE 
      WHEN POSITION(' ' IN name) > 0 THEN SUBSTRING(name FROM POSITION(' ' IN name) + 1)
      ELSE ''
    END
WHERE first_name IS NULL AND name IS NOT NULL;

-- Actualizar is_google_account basado en si tienen avatar de Google
UPDATE users 
SET is_google_account = true 
WHERE avatar IS NOT NULL AND avatar LIKE '%googleusercontent.com%';
