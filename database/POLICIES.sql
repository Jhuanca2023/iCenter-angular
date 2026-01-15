-- ============================================
-- POLÍTICAS RLS (Row Level Security) - iCenter
-- ============================================

-- Deshabilitar RLS temporalmente para desarrollo
-- (Habilitar después de configurar políticas de seguridad)

-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE products DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

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

-- TODO: Implementar políticas basadas en rol del usuario
-- Ejemplo:
-- CREATE POLICY "Admin full access products"
--   ON products FOR ALL
--   USING (
--     EXISTS (
--       SELECT 1 FROM users
--       WHERE users.id = auth.uid()
--       AND users.role = 'Administrador'
--     )
--   );

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
