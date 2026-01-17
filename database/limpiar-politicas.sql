-- ============================================
-- SCRIPT PARA LIMPIAR TODAS LAS POLÍTICAS
-- ============================================
-- Ejecuta este script PRIMERO si tienes errores de políticas duplicadas
-- Luego ejecuta POLICIES.sql

-- Eliminar todas las políticas de products
DROP POLICY IF EXISTS "Productos públicos visibles" ON products;
DROP POLICY IF EXISTS "Admins full access products" ON products;

-- Eliminar todas las políticas de brands
DROP POLICY IF EXISTS "Marcas públicas visibles" ON brands;
DROP POLICY IF EXISTS "Admins full access brands" ON brands;

-- Eliminar todas las políticas de categories
DROP POLICY IF EXISTS "Categorías públicas visibles" ON categories;
DROP POLICY IF EXISTS "Admins full access categories" ON categories;

-- Eliminar todas las políticas de users
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Eliminar todas las políticas de orders
DROP POLICY IF EXISTS "Users can read own orders" ON orders;
DROP POLICY IF EXISTS "Admins can read all orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Admins can update orders" ON orders;

-- Eliminar todas las políticas de storage
DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Category Images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload category images" ON storage.objects;
