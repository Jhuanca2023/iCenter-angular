-- ============================================
-- CORREGIR POLÍTICAS RLS PARA USUARIOS
-- ============================================
-- Este script corrige las políticas RLS para permitir que los usuarios se creen a sí mismos
-- Ejecutar en Supabase SQL Editor

-- Eliminar políticas existentes de users si hay problemas
DROP POLICY IF EXISTS "Users can insert themselves" ON users;
DROP POLICY IF EXISTS "Users can update themselves" ON users;

-- Crear política para que los usuarios se puedan insertar a sí mismos
CREATE POLICY "Users can insert themselves"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Crear política para que los usuarios se puedan actualizar a sí mismos
CREATE POLICY "Users can update themselves"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Verificar que las políticas existen
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'users'
ORDER BY policyname;

-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'users';
