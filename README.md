# iCenter E-Commerce - Angular + Supabase

Aplicación de e-commerce completa desarrollada con Angular 19 y Supabase, que incluye panel de administración, vista de cliente, pasarela de pagos con Stripe y sistema de gestión integral.

## Tecnologías Utilizadas

- Angular 19 (Uso de Signals, SSR y Control Flow Syntax)
- Supabase (PostgreSQL, Autenticación, Storage y RLS)
- Stripe JS (Pasarela de pagos segura)
- Tailwind CSS (Diseño responsivo y moderno)
- Chart.js (Visualización de datos y estadísticas)
- Canvas-confetti (Efectos visuales de experiencia de usuario)
- TypeScript (Lenguaje de programación principal)
- Netlify (Plataforma de despliegue y hosting)
- RxJS (Programación reactiva)
- PostCSS (Procesamiento de estilos)

## Características Principales

- Autenticación segura: Soporte para Email/Password y Google OAuth a través de Supabase.
- Panel de Administración: Gestión completa de productos, categorías, marcas, usuarios y pedidos.
- Pasarela de Pagos: Integración completa con Stripe para transacciones reales y seguras.
- Libro de Reclamaciones: Sistema digital para gestión de quejas y reclamos.
- Sistema de Favoritos: Los usuarios pueden guardar productos de su interés.
- Reseñas y Especificaciones: Soporte para comentarios de clientes y detalles técnicos de productos.
- Banners y Promociones: Gestión dinámica de publicidad en la plataforma.
- Seguridad RLS: Protección de datos a nivel de fila mediante políticas de Supabase.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
- Node.js 18.0 o superior
- Angular CLI: `npm install -g @angular/cli`
- Administrador de paquetes npm o Bun (recomendado)
- Cuenta activa en Supabase
- Cuenta de desarrollador en Stripe (para pagos)

## Configuración del Proyecto

### 1. Clonar el repositorio

bash
git clone https://github.com/Jhuanca2023/iCenter-angular.git
cd iCenter-angular


### 2. Instalación de dependencias

Ejecuta el siguiente comando para instalar todas las dependencias necesarias:

bash
npm install
# o si usas Bun
bun install


### 3. Configuración de Variables de Entorno

Crear o editar el archivo `src/environments/environment.ts` con tus credenciales:

typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://TU_PROYECTO.supabase.co',
  supabaseAnonKey: 'TU_ANON_KEY',
  stripePublicKey: 'TU_STRIPE_PUBLIC_KEY'
};


## Configuración de Base de Datos (Supabase)

Para el correcto funcionamiento del sistema, debes ejecutar los scripts SQL en el Editor SQL de Supabase en el siguiente orden estricto:

1. database/schema-fixed.sql - Inicializa la estructura base del sistema (Tablas de usuarios, marcas, categorías y productos).
2. database/POLICIES.sql - Configura las reglas de seguridad RLS para proteger los datos.
3. database/add-user-fields.sql - Agrega campos adicionales necesarios para el perfil de usuario.
4. database/add-auth-provider.sql - Configura el soporte para proveedores de autenticación externos.
5. database/banners-promotions-schema.sql - Crea las tablas para la gestión de publicidad y promociones.
6. database/create-claims-schema.sql - Establece la estructura para el libro de reclamaciones.
7. database/create-favorites.sql - Activa la funcionalidad de lista de deseos para los usuarios.
8. database/update-schema-reviews-specs.sql - Agrega soporte para reseñas de clientes y fichas técnicas.
9. database/add-stripe-columns.sql - Prepara la base de datos para la integración con Stripe.
10. database/create-admin-user.sql - Script de ayuda para la creación del primer administrador.

### Configuración de Storage en Supabase

Es necesario crear los siguientes buckets en la sección de Storage y marcarlos como públicos:
- product-images: Para las fotografías de los productos.
- category-images: Para los iconos e imágenes de categorías.
- avatars: Para las fotos de perfil de los usuarios.

## Estructura de Módulos

El proyecto está organizado siguiendo una arquitectura modular:

- src/app/modules/admin: Módulo de administración para gestión interna.
- src/app/modules/auth: Gestión de inicio de sesión, registro y recuperación.
- src/app/modules/products: Catálogo, filtros y detalles de productos.
- src/app/modules/cart: Gestión del carrito de compras local y persistente.
- src/app/modules/checkout: Proceso de pago e integración con Stripe.
- src/app/modules/user: Perfil de usuario, historial de pedidos y direcciones.
- src/app/modules/claims: Módulo dedicado al libro de reclamaciones.
- src/app/modules/nosotros: Información corporativa del proyecto.
- src/app/modules/eventos: Sección de noticias y eventos destacados.
- src/app/modules/favorites: Almacenamiento de productos preferidos.

## Estructura del Proyecto

```text
src/
├── app/
│   ├── core/                # Configuración, guards, interceptores y servicios globales
│   ├── modules/             # Módulos funcionales de la aplicación
│   │   ├── admin/           # Gestión administrativa
│   │   ├── auth/            # Autenticación y registro
│   │   ├── products/        # Catálogo y detalle de productos
│   │   └── ...              # Otros módulos funcionales
│   └── shared/              # Componentes, layouts y pipes compartidos
├── assets/                  # Recursos estáticos (imágenes, fuentes)
└── environments/            # Variables de entorno (Desarrollo/Producción)

database/                    # Scripts SQL para la configuración de Supabase
supabase/                    # Configuración adicional de Supabase (opcional)
```

## Ejecución

### Modo Desarrollo
Ejecuta el servidor de desarrollo local:

bash
npm start


La aplicación se abrirá en `http://localhost:4200`.

### Construcción para Producción
Para generar el paquete optimizado de producción:

bash
npm run build


## Despliegue

Este proyecto está configurado para desplegarse fácilmente en Netlify. Solo necesitas conectar tu repositorio a un nuevo sitio en Netlify y configurar las variables de entorno correspondientes.

## Notas de Seguridad

- Nunca expongas tu `service_role key` de Supabase en el frontend.
- Asegúrate de que las políticas RLS estén siempre activas en producción.
- Valida los webhooks de Stripe solo mediante firmas oficiales.

## Contacto

Si tienes alguna duda o sugerencia, puedes contactarme en:
- **Email**: [josehuanca612@gmail.com](mailto:josehuanca612@gmail.com)

## Licencia

Este proyecto está bajo la **Apache License 2.0**. Consulta el archivo [LICENSE](./LICENSE) para más detalles.

## Screenshots

### Vista de Cliente
![Home](./public/home1.png)
![Destacados](./public/destacadoshome.png)
![Detalle de Producto](./public/detalleproducto.png)
![Carrito de Compras](./public/carrito-compras.png)
![Checkout](./public/checkout.png)
![Confirmación de Pago](./public/confirmacion-checkout.png)
![Mis Pedidos](./public/mis-pedidos.png)
![Eventos](./public/Eventos.png)
![Nosotros](./public/nosotros.png)
![Libro de Reclamaciones](./public/libro-reclamaciones.png)

### Panel de Administración
![Dashboard](./public/Dashboard-admin.png)
![Categorías](./public/admin-categorias.png)
![Detalle de Categoría](./public/admin-categoria-detalle.png)
![Marcas](./public/admin-marcas.png)
![Productos](./public/admin-productos.png)
![Detalle de Producto](./public/admin-producto-detalle.png)
![Pedidos](./public/admin-pedidos.png)
![Detalle de Pedido](./public/admin-pedidos-detalle.png)
![Usuarios](./public/Admin-Usuarios.png)
![Detalle de Usuario](./public/admin-usuarios-detalle.png)
![Banners](./public/admin-banners.png)
![Reclamos](./public/admin-reclamos.png)
![Detalle de Reclamo](./public/admin-reclamos-detalle.png)
![Perfil Admin](./public/admin-perfil.png)

---
Desarrollado para el sistema de gestión iCenter.
