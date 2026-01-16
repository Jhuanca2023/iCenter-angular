# 📋 Pasos Siguientes - Configuración de Supabase

## ✅ Completado
- [x] Proyecto creado en Supabase
- [x] Schema de base de datos ejecutado
- [x] Políticas RLS configuradas
- [x] Credenciales configuradas en environment.ts

## 🔄 Siguientes Pasos

### 1. Crear Buckets de Storage

#### 1.1 Bucket para Imágenes de Productos
1. En Supabase Dashboard, ve a **Storage**
2. Haz clic en **"New bucket"**
3. Configura:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **MARCAR** (importante para que las imágenes sean públicas)
   - **File size limit**: `5 MB` (o el que prefieras)
   - **Allowed MIME types**: `image/*` (o déjalo vacío)
4. Haz clic en **"Create bucket"**

#### 1.2 Bucket para Imágenes de Categorías
1. Haz clic en **"New bucket"** nuevamente
2. Configura:
   - **Name**: `category-images`
   - **Public bucket**: ✅ **MARCAR**
   - **File size limit**: `2 MB`
   - **Allowed MIME types**: `image/*`
3. Haz clic en **"Create bucket"**

### 2. Crear Usuario Administrador

#### 2.1 Crear Usuario en Supabase Auth
1. Ve a **Authentication > Users**
2. Haz clic en **"Add user" > "Create new user"**
3. Completa:
   - **Email**: `admin@icenter.com`
   - **Password**: (elige una contraseña segura y guárdala)
   - **Auto Confirm User**: ✅ **MARCAR** (para que no necesite confirmar email)
4. Haz clic en **"Create user"**
5. **IMPORTANTE**: Copia el **UUID** del usuario (lo verás en la lista de usuarios)

#### 2.2 Asignar Rol de Administrador
1. Ve a **SQL Editor**
2. Ejecuta este script (reemplaza `TU_UUID_AQUI` con el UUID que copiaste):

```sql
INSERT INTO users (id, email, name, role, status)
VALUES (
  'TU_UUID_AQUI',
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
```

#### 2.3 Verificar Usuario Administrador
1. Ve a **Table Editor > users**
2. Busca el usuario con email `admin@icenter.com`
3. Verifica que:
   - ✅ `role` = `Administrador`
   - ✅ `status` = `Activo`

### 3. Configurar Google OAuth (Opcional pero Recomendado)

#### 3.1 Crear OAuth en Google Cloud Console
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Ve a **APIs & Services > Credentials**
4. Haz clic en **"Create Credentials" > "OAuth client ID"**
5. Si es la primera vez, configura la pantalla de consentimiento
6. Crea el OAuth Client ID:
   - Tipo: **Web application**
   - Nombre: `Supabase OAuth`
   - **Authorized redirect URIs**: 
     ```
     https://pmmnphvaqfmefurempul.supabase.co/auth/v1/callback
     ```
7. Copia el **Client ID** y **Client Secret**

#### 3.2 Configurar en Supabase
1. En Supabase Dashboard, ve a **Authentication > Providers**
2. Busca **Google** y haz clic para habilitarlo
3. Pega el **Client ID** y **Client Secret**
4. Haz clic en **"Save"**

#### 3.3 Configurar URLs de Redirección
1. Ve a **Authentication > URL Configuration**
2. Agrega en **Redirect URLs**:
   ```
   http://localhost:4200/auth/callback
   ```
3. Haz clic en **"Save"**

### 4. Probar la Aplicación

#### 4.1 Iniciar Servidor de Desarrollo
```bash
npm start
```

#### 4.2 Probar Login
1. Abre `http://localhost:4200`
2. Ve a `/auth/login`
3. Inicia sesión con:
   - Email: `admin@icenter.com`
   - Password: (la que creaste)
4. Deberías ser redirigido a `/admin`

#### 4.3 Verificar Funcionalidades
- ✅ Puedes acceder al panel de administración
- ✅ Puedes ver el dashboard
- ✅ Puedes crear productos
- ✅ Las imágenes se suben correctamente

## 🎉 ¡Listo!

Si completaste todos los pasos, tu aplicación debería estar funcionando completamente.

## 🆘 Si algo no funciona

- **No puedo iniciar sesión**: Verifica que el usuario tenga rol "Administrador" en la tabla `users`
- **No puedo acceder a /admin**: Verifica que el guard esté activado y el usuario sea admin
- **Las imágenes no se suben**: Verifica que los buckets estén creados y sean públicos
- **Error de conexión**: Verifica las credenciales en `environment.ts`
