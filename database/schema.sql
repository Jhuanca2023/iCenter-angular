-- ============================================
-- ESQUEMA SQL PARA SUPABASE - iCenter
-- ============================================

-- 1. TABLA: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'Usuario' CHECK (role IN ('Administrador', 'Usuario')),
  status TEXT NOT NULL DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo')),
  last_access TIMESTAMPTZ,
  avatar TEXT,
  auth_provider TEXT DEFAULT 'email' CHECK (auth_provider IN ('email', 'google')),
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. TABLA: brands (marcas)
-- ============================================
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para brands
CREATE INDEX IF NOT EXISTS idx_brands_visible ON brands(visible);

-- 3. TABLA: categories (DEBE CREARSE ANTES DE brand_categories)
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  image_url TEXT,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para categories
CREATE INDEX IF NOT EXISTS idx_categories_brand ON categories(brand_id);
CREATE INDEX IF NOT EXISTS idx_categories_visible ON categories(visible);

-- Tabla intermedia: brand_categories (marcas - categorías)
-- DEBE CREARSE DESPUÉS DE categories
CREATE TABLE IF NOT EXISTS brand_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(brand_id, category_id)
);

-- Índices para brand_categories
CREATE INDEX IF NOT EXISTS idx_brand_categories_brand ON brand_categories(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_categories_category ON brand_categories(category_id);

-- 4. TABLA: products
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE RESTRICT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  sale_price DECIMAL(10, 2) CHECK (sale_price >= 0),
  on_sale BOOLEAN DEFAULT false,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  weight TEXT,
  status TEXT NOT NULL DEFAULT 'Activo' CHECK (status IN ('Activo', 'Inactivo', 'Borrador')),
  visible BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  recommended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla intermedia: product_categories (productos - categorías)
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, category_id)
);

-- 5. TABLA: product_colors
-- ============================================
CREATE TABLE IF NOT EXISTS product_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  hex TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA: product_color_images
-- ============================================
CREATE TABLE IF NOT EXISTS product_color_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_color_id UUID REFERENCES product_colors(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para products
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_visible ON products(visible);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_recommended ON products(recommended);
CREATE INDEX IF NOT EXISTS idx_products_on_sale ON products(on_sale);
CREATE INDEX IF NOT EXISTS idx_product_categories_product ON product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category ON product_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_product_colors_product ON product_colors(product_id);
CREATE INDEX IF NOT EXISTS idx_product_color_images_color ON product_color_images(product_color_id);

-- 7. TABLA: orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'En proceso', 'Completado', 'Cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABLA: order_items
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  product_color_id UUID REFERENCES product_colors(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para orders
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_colors_updated_at BEFORE UPDATE ON product_colors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_color_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajustar según necesidades de seguridad)
-- Por ahora, permitir lectura pública para productos visibles
CREATE POLICY "Productos públicos visibles" ON products
  FOR SELECT USING (visible = true AND status = 'Activo');

-- Los administradores pueden hacer todo (ajustar con auth)
-- CREATE POLICY "Admin full access" ON products
--   FOR ALL USING (auth.role() = 'administrator');

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista: products_with_details
CREATE OR REPLACE VIEW products_with_details AS
SELECT 
  p.*,
  b.name as brand_name,
  COUNT(DISTINCT pc.id) as color_count,
  COUNT(DISTINCT pci.id) as total_images
FROM products p
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN product_colors pc ON pc.product_id = p.id
LEFT JOIN product_color_images pci ON pci.product_color_id = pc.id
GROUP BY p.id, b.name;

-- Vista: categories_with_brand
CREATE OR REPLACE VIEW categories_with_brand AS
SELECT 
  c.*,
  b.name as brand_name
FROM categories c
LEFT JOIN brands b ON c.brand_id = b.id;
