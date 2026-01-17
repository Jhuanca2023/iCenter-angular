# Configurar Google OAuth en Supabase

## Pasos para habilitar Google OAuth

### 1. Ir al Dashboard de Supabase
1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto: `pmmnphvaqfmefurempul`

### 2. Configurar Google OAuth
1. Ve a **Authentication** → **Providers** en el menú lateral
2. Busca **Google** en la lista de proveedores
3. Haz clic en **Google** para abrir la configuración

### 3. Obtener credenciales de Google Cloud Console
1. Ve a https://console.cloud.google.com/
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **APIs & Services** → **Credentials**
4. Haz clic en **Create Credentials** → **OAuth client ID**
5. Selecciona **Web application**
6. Configura:
   - **Name**: iCenter Ecommerce
   - **Authorized JavaScript origins**: 
     - `http://localhost:4200` (desarrollo)
     - `https://tu-dominio.com` (producción)
   - **Authorized redirect URIs**:
     - `https://pmmnphvaqfmefurempul.supabase.co/auth/v1/callback`
     - `http://localhost:4200/auth/callback` (desarrollo)
     - `https://tu-dominio.com/auth/callback` (producción)
7. Copia el **Client ID** y **Client Secret**

### 4. Configurar en Supabase
1. En la configuración de Google en Supabase, pega:
   - **Client ID (for OAuth)**: Tu Client ID de Google
   - **Client Secret (for OAuth)**: Tu Client Secret de Google
2. Haz clic en **Save**

### 5. Verificar configuración
- El estado de Google debe cambiar a **Enabled**
- Deberías ver un mensaje de éxito

## Notas importantes

- **Redirect URI**: Asegúrate de que la URL de redirección en Google Cloud Console coincida exactamente con la que usa Supabase
- **Scopes**: Supabase solicita automáticamente los scopes necesarios (profile, email)
- **Imagen de perfil**: La imagen de perfil de Google se guardará automáticamente en el campo `avatar` de la tabla `users`

## Probar el login con Google

1. Ve a tu aplicación: `http://localhost:4200/auth/login`
2. Haz clic en **Continuar con Google**
3. Deberías ser redirigido a Google para autenticarte
4. Después de autenticarte, serás redirigido de vuelta a tu aplicación
5. Tu imagen de perfil debería aparecer en el header del admin

## Solución de problemas

### Error: "provider is not enabled"
- Verifica que Google esté habilitado en Supabase Dashboard
- Asegúrate de haber guardado las credenciales correctamente

### Error: "redirect_uri_mismatch"
- Verifica que la URL de redirección en Google Cloud Console coincida exactamente
- Asegúrate de incluir tanto `http://localhost:4200/auth/callback` como la URL de Supabase

### La imagen de perfil no aparece
- Verifica que el usuario tenga una imagen de perfil en Google
- Revisa la consola del navegador para ver si hay errores
- Verifica que el campo `avatar` se esté guardando en la tabla `users`
