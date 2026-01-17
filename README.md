# 🛒 iCenter E-Commerce - Angular + Supabase

Aplicación de e-commerce completa desarrollada con Angular y Supabase, con panel de administración y vista de cliente.

## 🚀 Características

- ✅ Autenticación segura (Email/Password y Google OAuth)
- ✅ Panel de administración completo
- ✅ Gestión de productos, categorías, marcas y usuarios
- ✅ Almacenamiento de imágenes en Supabase Storage
- ✅ Vista de cliente con catálogo de productos
- ✅ Sistema de roles (Administrador/Usuario)
- ✅ Políticas de seguridad RLS (Row Level Security)

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta en Supabase ([app.supabase.com](https://app.supabase.com))
- Angular CLI: `npm install -g @angular/cli`

## ⚙️ Configuración Inicial

### 1. Clonar e Instalar

```bash
git clone <tu-repositorio>
cd ecommerce-angular
npm install
```

### 2. Configurar Supabase

#### 2.1 Crear Proyecto en Supabase
1. Ve a [app.supabase.com](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Guarda la **Project URL** y **anon key**

#### 2.2 Configurar Base de Datos
1. En Supabase Dashboard, ve a **SQL Editor**
2. Ejecuta `database/schema-fixed.sql` (crea todas las tablas)
3. Ejecuta `database/POLICIES.sql` (configura políticas de seguridad)

#### 2.3 Configurar Storage
1. Ve a **Storage** en Supabase Dashboard
2. Crea bucket `product-images` (público)
3. Crea bucket `category-images` (público)

#### 2.4 Crear Usuario Administrador
1. Ve a **Authentication > Users**
2. Crea usuario con email `admin@icenter.com`
3. Copia el **UUID** del usuario
4. En **SQL Editor**, ejecuta:
```sql
INSERT INTO users (id, email, name, role, status)
VALUES (
  'PEGA_EL_UUID_AQUI',
  'admin@icenter.com',
  'Administrador',
  'Administrador',
  'Activo'
);
```

#### 2.5 Configurar Google OAuth (Opcional)
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea OAuth Client ID
3. Agrega redirect URI: `https://TU_PROYECTO.supabase.co/auth/v1/callback`
4. En Supabase: **Authentication > Providers > Google**
5. Pega Client ID y Secret

### 3. Configurar Variables de Entorno

Edita `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://TU_PROYECTO.supabase.co',
  supabaseAnonKey: 'tu_anon_key_aqui'
};
```

## 🏃 Ejecutar la Aplicación

### Desarrollo
```bash
npm start
# o
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### Producción
```bash
npm run build
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── config/          # Configuración de Supabase
│   │   ├── guards/          # Guards de autenticación
│   │   └── services/        # Servicios principales
│   ├── modules/
│   │   ├── admin/           # Panel de administración
│   │   ├── auth/            # Autenticación
│   │   └── products/        # Vista de productos
│   └── shared/              # Componentes compartidos
├── environments/             # Variables de entorno
database/
├── schema-fixed.sql         # Esquema de base de datos
└── POLICIES.sql            # Políticas RLS
```

## 🔐 Credenciales por Defecto

**Usuario Administrador:**
- Email: `admin@icenter.com`
- Password: (la que configuraste en Supabase Auth)

## 🛠️ Tecnologías Utilizadas

- **Angular** 17+
- **Supabase** (Backend as a Service)
- **TypeScript**
- **Tailwind CSS**
- **RxJS**

## 📚 Documentación Adicional

- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Angular](https://angular.io/docs)

## 🐛 Solución de Problemas

### Error: "Invalid API key"
- Verifica que la `anon key` en `environment.ts` sea correcta
- Asegúrate de usar la **anon key**, NO la service_role key

### Error: "Failed to fetch"
- Verifica que la URL de Supabase sea correcta
- Revisa la consola del navegador para errores de CORS

### No puedo iniciar sesión
- Verifica que el usuario exista en Supabase Auth
- Verifica que el usuario tenga rol "Administrador" en la tabla `users`
- Revisa la consola del navegador para errores

### Las imágenes no se suben
- Verifica que los buckets estén creados y sean públicos
- Verifica que las políticas de Storage permitan inserción

## 📝 Notas Importantes

- ⚠️ **NUNCA** compartas la `service_role key` públicamente
- ✅ Usa siempre la `anon key` en el frontend
- ✅ Las políticas RLS protegen los datos en el backend
- ✅ El usuario administrador debe tener rol "Administrador" en la tabla `users`

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Desarrollado con ❤️ usando Angular y Supabase**
