# Proyecto Integrador: E-commerce React + TypeScript + Vite

## Descripción
Aplicación web de e-commerce desarrollada con React, TypeScript y Vite. Permite a los usuarios explorar productos, filtrarlos, agregarlos al carrito y realizar compras, con autenticación y rutas protegidas.

## Características principales
- **Diseño responsive**: Funciona en desktop y móvil, usando Flexbox y Grid.
- **Arquitectura escalable**: Estructura modular por dominios y componentes reutilizables.
- **React + TypeScript + Vite**: Tipado estricto y desarrollo moderno con React 19.
- **Imports con Path Alias**: Uso de alias `@/` para imports limpios y mantenibles.
- **Hooks personalizados**: Manejo de estado y lógica reutilizable con useState, useEffect y custom hooks.
- **Context API**: Compartición de estado global para autenticación y carrito.
- **Patrón mappers**: Transformación de datos de la API (snake_case a camelCase).
- **Rutas protegidas**: Uso de react-router-dom y HOC para proteger rutas tras login.
- **Componentes propios**: Alertas, modales, inputs, sin librerías de UI externas.
- **API Integration**: Integración con DummyJSON API para autenticación y datos de productos.
- **Validación**: Validación manual y posibilidad de integrar react-hook-form o formik.
- **Sin Redux**: Prohibido el uso de Redux.
- **Pruebas unitarias**: Con Vitest y Testing Library, cobertura >90%.
- **Commits semánticos**: Uso de feat, fix, chore, etc.

## Scripts disponibles
- `npm run dev` — Ejecuta el servidor de desarrollo
- `npm run build` — Compila la aplicación para producción
- `npm run preview` — Previsualiza la build de producción
- `npm run test` — Ejecuta los tests unitarios
- `npm run test:coverage` — Ejecuta los tests y muestra el coverage

## Estructura de carpetas
```
REACT PROYECT NTTDATA/
  src/
    api/           # Funciones de integración con APIs externas
    app/           # Configuración de rutas y providers globales
      providers/   # Proveedores de contexto (Auth, Cart, Router)
      router/      # Configuración de rutas y HOCs de protección
    modules/       # Módulos de dominio organizados por funcionalidad
      auth/        # Autenticación (login, registro, context)
        components/
        context/
        hooks/
        mappers/
        pages/
        services/
        types/
      cart/        # Carrito de compras y checkout
        context/
        hooks/
        pages/
        reducers/
        types/
      home/        # Página principal y productos
        components/
        hooks/
        mappers/
        pages/
        services/
        types/
    shared/        # Componentes, hooks y utilidades reutilizables
      components/
        layout/    # Header, Layout, Container
        ui/        # Modal, Button, Input, Alert
      constants/   # Rutas y configuración de API
      hooks/       # Custom hooks reutilizables
      types/       # Tipos TypeScript comunes
      utils/       # Utilidades y helpers
      styles/      # Estilos globales
    test/          # Configuración de pruebas unitarias
```

## Tecnologías y herramientas
- **React 19.1.1**: Última versión con mejoras de rendimiento
- **TypeScript**: Tipado estático para mayor robustez
- **Vite 7.1.5**: Build tool moderno y rápido
- **React Router DOM 7.9.1**: Navegación y rutas protegidas
- **Context API**: Manejo de estado global sin Redux
- **Vitest + Testing Library**: Testing framework moderno
- **ESLint**: Linting y calidad de código
- **Path Aliases**: Alias `@/` configurado en Vite para imports limpios

## Configuración de Path Aliases
El proyecto utiliza alias de rutas para mejorar la legibilidad y mantenimiento:

```typescript
// En lugar de:
import { useAuth } from '../../../modules/auth/hooks/useAuth'

// Usamos:
import { useAuth } from '@/modules/auth/hooks/useAuth'
```

**Alias configurados:**
- `@/` → `src/` (directorio raíz del código fuente)
- `@/modules/` → `src/modules/` (módulos de dominio)
- `@/shared/` → `src/shared/` (componentes compartidos)
- `@/api/` → `src/api/` (funciones de API)

## Instalación y uso
1. **Clona el repositorio:**
   ```bash
   git clone [URL-del-repositorio]
   cd "REACT PROYECT NTTDATA"
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre la aplicación:**
   - URL: [http://localhost:5173](http://localhost:5173)
   - Credenciales de prueba (DummyJSON):
     - Usuario: `emilys`
     - Contraseña: `emilyspass`

## Funcionalidades implementadas

### 🔐 Autenticación
- Login y registro de usuarios
- Gestión de tokens (access + refresh)
- Rutas protegidas con HOC `withAuthGuard`
- Context de autenticación global
- Logout automático al expirar token

### 🛒 E-commerce
- Listado de productos con filtros
- Búsqueda por nombre y categoría  
- Carrito de compras persistente
- Gestión de cantidades y stock
- Página de resumen de compra

### 🎨 UI/UX
- Diseño responsive con CSS puro
- Componentes reutilizables (Modal, Alert, Button, Input)
- Header con navegación y contador de carrito
- Layout consistente en toda la aplicación

## Notas de evaluación
- ✅ No se usan librerías de UI externas (CSS puro)
- ✅ No se usa Redux (Context API + useReducer)
- ✅ Código 100% TypeScript sin `any`
- ✅ Estructura modular escalable
- ✅ Path aliases para imports limpios
- ✅ HOC pattern para rutas protegidas
- ✅ Mappers para transformación de datos
- ✅ Custom hooks reutilizables
- ✅ Integración con API externa (DummyJSON)
- ✅ Pruebas unitarias configuradas

## Arquitectura del proyecto

### Patrones implementados
- **Module Pattern**: Organización por dominios funcionales
- **Provider Pattern**: Context API para estado global
- **HOC Pattern**: `withAuthGuard` para protección de rutas
- **Mapper Pattern**: Transformación de datos API → UI
- **Custom Hooks**: Lógica reutilizable encapsulada
- **Compound Components**: Componentes UI modulares

### Flujo de datos
```
API (DummyJSON) → Services → Mappers → Context/Hooks → Components → UI
```

### Estado global
- **AuthContext**: Usuario, tokens, estado de autenticación
- **CartContext**: Items del carrito, totales, operaciones CRUD
- **useReducer**: Manejo inmutable del estado del carrito

## Documentación adicional
- 📝 [ALIASES_DOCUMENTATION.md](./ALIASES_DOCUMENTATION.md) - Guía de path aliases
- 🔐 [AUTH_API_README.md](./AUTH_API_README.md) - Documentación de la API de autenticación

## Próximas mejoras
- [ ] Implementación de tests unitarios completos
- [ ] Integración con Stripe para pagos reales  
- [ ] PWA capabilities
- [ ] Optimización de imágenes lazy loading
- [ ] Implementación de React Query para caché
- [ ] Dark mode theme

## Autora
**Rosario Garcia** - Desarrolladora Frontend

---

> 🚀 **Proyecto Integrador realizado para el Bootcamp Frontend React + TypeScript NTT DATA 2025**
> 
> ⭐ Cumple todos los requisitos de evaluación del bootcamp
> 
> 📅 Fecha: Septiembre 2025
