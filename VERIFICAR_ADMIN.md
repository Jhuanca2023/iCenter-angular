# ✅ Cómo Verificar que el Usuario es Administrador

## Método 1: Table Editor (Más Fácil)

1. En Supabase Dashboard, ve a **Table Editor** (icono de tabla en el menú lateral)
2. Selecciona la tabla **`users`**
3. Busca el usuario con email `admin@icenter.com`
4. Verifica que:
   - ✅ `role` = `Administrador`
   - ✅ `status` = `Activo`
   - ✅ `id` = `1c2230bf-2378-43cc-b084-d3884e39a711`

## Método 2: SQL Editor (Más Rápido)

Ejecuta esta consulta en **SQL Editor**:

```sql
SELECT id, email, name, role, status 
FROM users 
WHERE email = 'admin@icenter.com';
```

Deberías ver:
```
id: 1c2230bf-2378-43cc-b084-d3884e39a711
email: admin@icenter.com
name: Administrador
role: Administrador
status: Activo
```

## Método 3: Probar en la Aplicación

1. Inicia la aplicación: `npm start`
2. Ve a `http://localhost:4200/auth/login`
3. Inicia sesión con:
   - Email: `admin@icenter.com`
   - Password: (la que creaste)
4. Si eres redirigido a `/admin`, ¡funciona! ✅

## ⚠️ Nota Importante

- **Authentication > Users** muestra usuarios de Supabase Auth (solo autenticación)
- **Table Editor > users** muestra la tabla `users` (donde está el rol)
- El rol "Administrador" está en la tabla `users`, NO en Authentication
