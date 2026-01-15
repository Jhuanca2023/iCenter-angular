# 🚀 Pasos Completos para Integrar Supabase - iCenter

## ✅ Paso 1: Instalación (COMPLETADO)
```bash
npm install @supabase/supabase-js
```
✅ **Estado**: Instalado correctamente

---

## 📝 Paso 2: Configurar Variables de Entorno

### 2.1 Crear archivo `.env` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### 2.2 Configurar en `angular.json` (si es necesario)
Para que Angular reconozca las variables de entorno, verificar que `angular.json` tenga configurado el soporte para variables de entorno.

**Archivos creados:**
- ✅ `src/environments/environment.ts` - Configuración base
- ✅ `src/app/core/config/supabase.config.ts` - Cliente Supabase

---

## 🗄️ Paso 3: Crear Tablas en Supabase

### 3.1 Ir a Supabase Dashboard
1. Ve a tu proyecto en https://app.supabase.com
2. Navega a **SQL Editor**
3. Copia y ejecuta el contenido de `SUPABASE_SCHEMA.sql`

### 3.2 Tablas que se crearán:
- ✅ `users` - Usuarios del sistema
- ✅ `brands` - Marcas
- ✅ `categories` - Categorías
- ✅ `products` - Productos
- ✅ `product_colors` - Colores de productos
- ✅ `product_color_images` - Imágenes de colores
- ✅ `orders` - Pedidos
- ✅ `order_items` - Items de pedidos
- ✅ `brand_categories` - Relación marcas-categorías
- ✅ `product_categories` - Relación productos-categorías

### 3.3 Configurar Storage
1. Ve a **Storage** en el Dashboard
2. Crea buckets:
   - `product-images` (público)
   - `category-images` (público)
3. Configura políticas de acceso según necesites

---

## 🔧 Paso 4: Servicios Creados

**Servicios Base:**
- ✅ `core/config/supabase.config.ts` - Cliente base
- ✅ `core/services/brands.service.ts` - CRUD de marcas
- ✅ `core/services/categories.service.ts` - CRUD de categorías
- ✅ `core/services/users.service.ts` - CRUD de usuarios

**Servicios Pendientes:**
- ⏳ `core/services/products.service.ts` - CRUD de productos
- ⏳ `core/services/orders.service.ts` - CRUD de pedidos
- ⏳ `core/services/storage.service.ts` - Gestión de imágenes

---

## 📋 Paso 5: Reemplazar Datos Mock

### Archivos con datos mock a eliminar:

#### Usuarios:
- `src/app/modules/admin/pages/users/users.component.ts`
  - Eliminar array `users` mock
  - Usar `UsersService.getAll()`

#### Productos:
- `src/app/modules/admin/pages/productos/productos.component.ts`
- `src/app/modules/admin/pages/productos/product-create/product-create.component.ts`
- `src/app/modules/admin/pages/productos/product-edit/product-edit.component.ts`
- `src/app/modules/admin/pages/productos/product-detail/product-detail.component.ts`

#### Categorías:
- `src/app/modules/admin/pages/categories/categories.component.ts`
- `src/app/modules/admin/pages/categories/category-create/category-create.component.ts`

#### Marcas:
- `src/app/modules/admin/pages/marcas/marcas.component.ts`
- `src/app/modules/admin/pages/marcas/marca-create/marca-create.component.ts`
- `src/app/modules/admin/pages/marcas/marca-edit/marca-edit.component.ts`

#### Pedidos:
- `src/app/modules/admin/pages/orders/orders.component.ts`

---

## 🎯 Próximos Pasos

1. **Completar servicios faltantes** (products, orders, storage)
2. **Actualizar componentes** para usar servicios
3. **Eliminar todas las URLs mock** de imágenes
4. **Probar CRUD completo** de cada entidad
5. **Configurar autenticación** si es necesario

---

## 📚 Recursos

- **Esquema SQL**: `SUPABASE_SCHEMA.sql`
- **Documentación**: `SUPABASE_INTEGRATION.md`
- **Supabase Docs**: https://supabase.com/docs
