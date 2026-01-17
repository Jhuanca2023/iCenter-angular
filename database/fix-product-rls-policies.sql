-- ============================================
-- POLÍTICAS RLS PARA PRODUCT_COLORS Y PRODUCT_CATEGORIES
-- ============================================
-- Este script agrega las políticas RLS faltantes para permitir
-- a los administradores crear productos con colores y categorías

-- Eliminar políticas existentes si existen
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Admins full access product_categories" ON product_categories;
  DROP POLICY IF EXISTS "Admins full access product_colors" ON product_colors;
  DROP POLICY IF EXISTS "Admins full access product_color_images" ON product_color_images;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Función helper para verificar si el usuario es administrador
-- (Esta función debería existir ya, pero la verificamos)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'Administrador'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas para product_categories
CREATE POLICY "Admins full access product_categories"
  ON product_categories FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Políticas para product_colors
CREATE POLICY "Admins full access product_colors"
  ON product_colors FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Políticas para product_color_images
CREATE POLICY "Admins full access product_color_images"
  ON product_color_images FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());
