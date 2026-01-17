-- ============================================
-- CREAR USUARIO DE GOOGLE EN LA TABLA users
-- ============================================
-- Este script crea el registro del usuario de Google en la tabla users
-- Ejecutar después de que el usuario se haya registrado con Google en Supabase Auth

-- IMPORTANTE: Reemplaza 'fda3c26c-a6f4-4535-97e2-889ce5c55949' con el UUID real del usuario
-- Puedes obtenerlo desde Authentication > Users en Supabase Dashboard

-- Insertar usuario de Google en la tabla users
INSERT INTO users (
  id,
  email,
  name,
  role,
  status,
  auth_provider,
  first_name,
  last_name,
  avatar,
  last_access,
  created_at,
  updated_at
)
VALUES (
  'fda3c26c-a6f4-4535-97e2-889ce5c55949',  -- UUID del usuario de Supabase Auth
  'josehuanca612@gmail.com',                -- Email del usuario
  'Jose Huanca',                            -- Nombre completo
  'Usuario',                                -- Rol por defecto
  'Activo',                                 -- Estado
  'google',                                 -- Proveedor de autenticación
  'Jose',                                   -- Primer nombre
  'Huanca',                                 -- Apellido
  NULL,                                     -- Avatar (puedes agregar la URL si la tienes)
  NOW(),                                    -- Último acceso
  NOW(),                                    -- Fecha de creación
  NOW()                                     -- Fecha de actualización
)
ON CONFLICT (id) DO UPDATE
SET 
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  auth_provider = 'google',
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  last_access = NOW(),
  updated_at = NOW();

-- Verificar que el usuario se creó correctamente
SELECT id, email, name, role, status, auth_provider, created_at 
FROM users 
WHERE id = 'fda3c26c-a6f4-4535-97e2-889ce5c55949';
