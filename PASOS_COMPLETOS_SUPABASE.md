# 🎯 PASOS COMPLETOS PARA INTEGRAR SUPABASE - iCenter

## ✅ ESTADO ACTUAL

### Completado:
- ✅ Instalado `@supabase/supabase-js`
- ✅ Creada configuración base en `src/app/core/config/supabase.config.ts`
- ✅ Creado archivo de entorno `src/environments/environment.ts`
- ✅ Creado esquema SQL completo en `SUPABASE_SCHEMA.sql`
- ✅ Creados servicios:
  - ✅ `core/services/brands.service.ts`
  - ✅ `core/services/categories.service.ts`
  - ✅ `core/services/users.service.ts`
  - ✅ `core/services/products.service.ts`
  - ✅ `core/services/orders.service.ts`
  - ✅ `core/services/storage.service.ts`

---

## 📝 PASOS PARA COMPLETAR LA INTEGRACIÓN

### PASO 1: Configurar Variables de Entorno

1. **Crea tu proyecto en Supabase:**
   - Ve a https://app.supabase.com
   - Crea un nuevo proyecto
   - Espera a que se complete la configuración

2. **Obtén tus credenciales:**
   - Ve a **Settings** → **API**
   - Copia:
     - **Project URL** → `VITE_SUPABASE_URL`
     - **anon public** key → `VITE_SUPABASE_ANON_KEY`

3. **Crea archivo `.env` en la raíz del proyecto:**
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
   ```

4. **Para producción, crea `.env.production`:**
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
   ```

---

### PASO 2: Ejecutar Esquema SQL

1. En Supabase Dashboard, ve a **SQL Editor**
2. Copia TODO el contenido de `SUPABASE_SCHEMA.sql`
3. Pégalo y ejecuta (botón **RUN**)
4. Verifica que todas las tablas se crearon correctamente en **Table Editor**

**Tablas que se crearán:**
- `users`
- `brands`
- `categories`
- `brand_categories`
- `products`
- `product_categories`
- `product_colors`
- `product_color_images`
- `orders`
- `order_items`

---

### PASO 3: Configurar Storage

1. Ve a **Storage** en Supabase Dashboard
2. Crea buckets:

   **Bucket 1: `product-images`**
   - Nombre: `product-images`
   - Público: ✅ **SÍ**
   - Policies: Permitir lectura pública

   **Bucket 2: `category-images`**
   - Nombre: `category-images`
   - Público: ✅ **SÍ**
   - Policies: Permitir lectura pública

3. **Políticas de Storage (SQL Editor):**
   ```sql
   -- Permitir lectura pública
   CREATE POLICY "Public Access" ON storage.objects
     FOR SELECT USING (bucket_id = 'product-images' OR bucket_id = 'category-images');

   -- Permitir inserción autenticada (ajustar según necesidades)
   CREATE POLICY "Authenticated users can upload" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'product-images' OR bucket_id = 'category-images');
   ```

---

### PASO 4: Actualizar Componentes (Pendiente)

Ahora necesitamos reemplazar todos los datos mock por llamadas a los servicios.

**Archivos a actualizar:**

#### Usuarios:
- `users.component.ts` - Reemplazar array mock con `UsersService.getAll()`
- `user-create.component.ts` - Usar `UsersService.create()`
- `user-edit.component.ts` - Usar `UsersService.update()`
- `user-detail.component.ts` - Usar `UsersService.getById()`
- `user-delete.component.ts` - Usar `UsersService.delete()`

#### Productos:
- `productos.component.ts` - Usar `ProductsService.getAll()`
- `product-create.component.ts` - Usar `ProductsService.create()` y `StorageService`
- `product-edit.component.ts` - Usar `ProductsService.update()`
- `product-detail.component.ts` - Usar `ProductsService.getById()`
- `product-delete.component.ts` - Usar `ProductsService.delete()`

#### Categorías:
- `categories.component.ts` - Usar `CategoriesService.getAll()`
- `category-create.component.ts` - Usar `CategoriesService.create()`
- `category-edit.component.ts` - Usar `CategoriesService.update()`
- `category-detail.component.ts` - Usar `CategoriesService.getById()`
- `category-delete.component.ts` - Usar `CategoriesService.delete()`

#### Marcas:
- `marcas.component.ts` - Usar `BrandsService.getAll()`
- `marca-create.component.ts` - Usar `BrandsService.create()`
- `marca-edit.component.ts` - Usar `BrandsService.update()`
- `marca-detail.component.ts` - Usar `BrandsService.getById()`
- `marca-delete.component.ts` - Usar `BrandsService.delete()`

#### Pedidos:
- `orders.component.ts` - Usar `OrdersService.getAll()`

---

### PASO 5: Eliminar Datos Mock

Buscar y eliminar:
- ❌ Arrays hardcodeados de datos
- ❌ URLs de imágenes de Unsplash
- ❌ Objetos mock en `loadProductData()`, `loadMarcaData()`, etc.
- ❌ Datos de prueba en componentes

---

## 🔄 FLUJO DE TRABAJO RECOMENDADO

1. **Configurar Supabase** (Paso 1 y 2)
2. **Probar servicios** individualmente (usar console.log)
3. **Actualizar un componente** completo (ej: marcas)
4. **Probar CRUD completo** de ese componente
5. **Repetir** para cada entidad

---

## 📋 CHECKLIST FINAL

- [ ] Variables de entorno configuradas
- [ ] Esquema SQL ejecutado
- [ ] Storage buckets creados
- [ ] Servicios probados
- [ ] Componentes de usuarios actualizados
- [ ] Componentes de productos actualizados
- [ ] Componentes de categorías actualizados
- [ ] Componentes de marcas actualizados
- [ ] Componentes de pedidos actualizados
- [ ] Todas las URLs mock eliminadas
- [ ] Subida de imágenes funcionando
- [ ] Paginación funcionando con datos reales

---

## 🚨 IMPORTANTE

1. **Backup de datos**: Antes de eliminar mocks, asegúrate de tener backup si necesitas datos de prueba
2. **Pruebas**: Prueba cada servicio antes de actualizar componentes
3. **Errores**: Revisa la consola del navegador y los logs de Supabase para errores
4. **RLS (Row Level Security)**: Ajusta las políticas de seguridad según tus necesidades

---

## 📚 RECURSOS

- **Supabase Dashboard**: https://app.supabase.com
- **Documentación**: https://supabase.com/docs
- **Esquema SQL**: `SUPABASE_SCHEMA.sql`
- **Variables de entorno**: `.env.example`
