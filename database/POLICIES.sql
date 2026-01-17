-- ============================================
-- POLÍTICAS RLS (Row Level Security) - iCenter
-- ============================================
-- IMPORTANTE: Si ya ejecutaste el schema.sql, algunas políticas básicas ya existen
-- Este script las elimina y recrea todas las políticas correctamente

-- ============================================
-- ELIMINAR TODAS LAS POLÍTICAS EXISTENTES
-- ============================================

-- Eliminar políticas de products
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Productos públicos visibles" ON products;
  DROP POLICY IF EXISTS "Admins full access products" ON products;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Eliminar políticas de brands
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Marcas públicas visibles" ON brands;
  DROP POLICY IF EXISTS "Admins full access brands" ON brands;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Eliminar políticas de categories
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Categorías públicas visibles" ON categories;
  DROP POLICY IF EXISTS "Admins full access categories" ON categories;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Eliminar políticas de users
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read own data" ON users;
  DROP POLICY IF EXISTS "Admins can read all users" ON users;
  DROP POLICY IF EXISTS "Admins can insert users" ON users;
  DROP POLICY IF EXISTS "Users can insert themselves" ON users;
  DROP POLICY IF EXISTS "Admins can update users" ON users;
  DROP POLICY IF EXISTS "Users can update themselves" ON users;
  DROP POLICY IF EXISTS "Admins can delete users" ON users;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Eliminar políticas de orders
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can read own orders" ON orders;
  DROP POLICY IF EXISTS "Admins can read all orders" ON orders;
  DROP POLICY IF EXISTS "Users can create own orders" ON orders;
  DROP POLICY IF EXISTS "Admins can update orders" ON orders;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Eliminar políticas de storage
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
  DROP POLICY IF EXISTS "Public Access Category Images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload product images" ON storage.objects;
  DROP POLICY IF EXISTS "Authenticated users can upload category images" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ============================================
-- POLÍTICAS PÚBLICAS (Lectura)
-- ============================================

-- Productos: Permitir lectura pública de productos visibles
CREATE POLICY "Productos públicos visibles"
  ON products FOR SELECT
  USING (visible = true AND status = 'Activo');

-- Marcas: Permitir lectura pública de marcas visibles
CREATE POLICY "Marcas públicas visibles"
  ON brands FOR SELECT
  USING (visible = true);

-- Categorías: Permitir lectura pública de categorías visibles
CREATE POLICY "Categorías públicas visibles"
  ON categories FOR SELECT
  USING (visible = true);

-- ============================================
-- POLÍTICAS ADMINISTRADOR (CRUD Completo)
-- ============================================

-- Función helper para verificar si el usuario es administrador
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'Administrador'
    AND status = 'Activo'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Políticas para Users
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  WITH CHECK (is_admin());

-- Permitir que los usuarios se creen a sí mismos (para registro con Google/Email)
CREATE POLICY "Users can insert themselves"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update users"
  ON users FOR UPDATE
  USING (is_admin());

-- Permitir que los usuarios se actualicen a sí mismos
CREATE POLICY "Users can update themselves"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  USING (is_admin());

-- Políticas para Products
CREATE POLICY "Admins full access products"
  ON products FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Políticas para Brands
CREATE POLICY "Admins full access brands"
  ON brands FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Políticas para Categories
CREATE POLICY "Admins full access categories"
  ON categories FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Políticas para Orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all orders"
  ON orders FOR SELECT
  USING (is_admin());

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- POLÍTICAS STORAGE
-- ============================================

-- Permiso de lectura pública para imágenes de productos
CREATE POLICY "Public Access Product Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Public Access Category Images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

-- Permiso de inserción para usuarios autenticados
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can upload category images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'category-images'
    AND auth.role() = 'authenticated'
  );
