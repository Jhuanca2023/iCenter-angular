-- ============================================
-- CREAR USUARIO ADMINISTRADOR POR DEFECTO
-- ============================================
-- Este script crea un usuario administrador por defecto en Supabase
-- Ejecutar después de crear la tabla users en Supabase

-- IMPORTANTE: Primero debes crear el usuario en Supabase Auth manualmente o mediante la API
-- Luego ejecuta este script para asignarle el rol de Administrador en la tabla users

-- Opción 1: Si ya tienes un usuario creado en Supabase Auth, reemplaza el UUID aquí
-- Puedes obtener el UUID del usuario desde la tabla auth.users en Supabase

-- Ejemplo de creación manual:
-- 1. Ve a Authentication > Users en Supabase Dashboard
-- 2. Crea un nuevo usuario con email y password
-- 3. Copia el UUID del usuario creado
-- 4. Reemplaza 'TU_UUID_AQUI' con el UUID real

-- Crear usuario administrador en la tabla users
INSERT INTO users (id, email, name, role, status)
VALUES (
  'TU_UUID_AQUI',  -- Reemplazar con el UUID del usuario de Supabase Auth
  'admin@icenter.com',
  'Administrador',
  'Administrador',
  'Activo'
)
ON CONFLICT (id) DO UPDATE
SET 
  role = 'Administrador',
  status = 'Activo',
  updated_at = NOW();

-- ============================================
-- ALTERNATIVA: Crear usuario mediante función
-- ============================================
-- Si prefieres crear el usuario directamente desde la aplicación,
-- puedes usar esta función que se ejecutará automáticamente cuando
-- se registre un usuario con un email específico

-- Función para asignar rol de administrador automáticamente
CREATE OR REPLACE FUNCTION assign_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el email es el de administrador, asignar rol de Administrador
  IF NEW.email = 'admin@icenter.com' THEN
    INSERT INTO users (id, email, name, role, status)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', 'Administrador'),
      'Administrador',
      'Activo'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      role = 'Administrador',
      status = 'Activo',
      updated_at = NOW();
  ELSE
    -- Para otros usuarios, crear con rol de Usuario
    INSERT INTO users (id, email, name, role, status)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
      'Usuario',
      'Activo'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que se ejecuta cuando se crea un nuevo usuario en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_admin_role();

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- 1. El email 'admin@icenter.com' será automáticamente asignado como Administrador
-- 2. Puedes cambiar este email en la función assign_admin_role()
-- 3. Todos los demás usuarios se crearán con rol 'Usuario' por defecto
-- 4. Asegúrate de que las políticas RLS permitan la inserción en la tabla users
-- 5. El trigger se ejecuta automáticamente cuando se crea un usuario en Supabase Auth
