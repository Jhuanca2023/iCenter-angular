# Plan de Integración de Supabase - iCenter

## 📋 Resumen
Este documento contiene todos los pasos para integrar Supabase y eliminar todos los datos mock del proyecto.

---

## 🔧 Paso 1: Instalación y Configuración Inicial

### 1.1 Instalar Supabase
```bash
npm install @supabase/supabase-js
```

### 1.2 Crear archivo de configuración
Crear: `src/app/core/config/supabase.config.ts`

### 1.3 Crear archivo de variables de entorno
Crear: `.env` (en la raíz del proyecto)
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

---

## 📊 Paso 2: Crear Esquema SQL en Supabase

### 2.1 Tablas necesarias

1. **users** - Usuarios del sistema
2. **brands** (marcas) - Marcas de productos
3. **categories** - Categorías de productos
4. **products** - Productos
5. **product_colors** - Colores de productos con imágenes
6. **orders** - Pedidos
7. **order_items** - Items de pedidos

### 2.2 Storage buckets
- `product-images` - Imágenes de productos
- `category-images` - Imágenes de categorías

---

## 🔌 Paso 3: Crear Servicios Supabase

Estructura de servicios:
```
src/app/core/services/
  ├── supabase.service.ts (cliente base)
  ├── users.service.ts
  ├── products.service.ts
  ├── categories.service.ts
  ├── brands.service.ts
  ├── orders.service.ts
  └── storage.service.ts
```

---

## 🗂️ Paso 4: Reemplazar Datos Mock

### Componentes a actualizar:

#### Admin:
- ✅ `users.component.ts` - Eliminar array mock de users
- ✅ `productos.component.ts` - Eliminar array mock de products
- ✅ `categories.component.ts` - Eliminar array mock de categories
- ✅ `marcas.component.ts` - Eliminar array mock de brands
- ✅ `orders.component.ts` - Eliminar array mock de orders
- ✅ `product-create.component.ts` - Eliminar arrays mock de brands/categories
- ✅ `product-edit.component.ts` - Eliminar loadProductData mock
- ✅ `product-detail.component.ts` - Eliminar loadProductData mock
- ✅ Todos los componentes de create/edit/detail - Actualizar métodos

#### Público:
- ✅ `product-list.component.ts` - Usar servicio real
- ✅ `product.service.ts` - Actualizar para usar Supabase
- ✅ `product-card.component.ts` - Ya está preparado

---

## 📝 Paso 5: Crear Interfaces TypeScript

Interfaces deben coincidir con las tablas de Supabase:
- Actualizar interfaces existentes para que coincidan con el esquema SQL
- Agregar campos de Supabase (id, created_at, updated_at, etc.)

---

## ✅ Checklist de Implementación

- [ ] Instalar @supabase/supabase-js
- [ ] Configurar variables de entorno
- [ ] Crear cliente Supabase
- [ ] Crear esquema SQL en Supabase Dashboard
- [ ] Crear todos los servicios
- [ ] Configurar Storage buckets
- [ ] Reemplazar datos mock en usuarios
- [ ] Reemplazar datos mock en productos
- [ ] Reemplazar datos mock en categorías
- [ ] Reemplazar datos mock en marcas
- [ ] Reemplazar datos mock en pedidos
- [ ] Probar CRUD completo de cada entidad
- [ ] Probar subida de imágenes
- [ ] Eliminar todas las URLs mock de imágenes

---

## 🚀 Siguiente Paso

Una vez que tengas tu proyecto de Supabase creado y las credenciales, empezamos con la implementación.
