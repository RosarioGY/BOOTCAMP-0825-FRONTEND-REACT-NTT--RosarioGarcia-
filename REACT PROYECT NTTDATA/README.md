# Proyecto Integrador: E-commerce React + TypeScript + Vite

## Descripción
Aplicación web de e-commerce desarrollada con React, TypeScript y Vite. Permite a los usuarios explorar productos, filtrarlos, agregarlos al carrito y realizar compras, con autenticación y rutas protegidas.

## Características principales
- **Diseño responsive**: Funciona en desktop y móvil, usando Flexbox y Grid.
- **Arquitectura escalable**: Estructura modular por dominios y componentes reutilizables.
- **React + TypeScript + Vite**: Tipado estricto y desarrollo moderno.
- **Hooks personalizados**: Manejo de estado y lógica reutilizable con useState, useEffect y custom hooks.
- **Context API**: Compartición de estado global para autenticación y carrito.
- **Patrón mappers**: Transformación de datos de la API (snake_case a camelCase).
- **Rutas protegidas**: Uso de react-router-dom y HOC para proteger rutas tras login.
- **Componentes propios**: Alertas, modales, inputs, sin librerías de UI externas.
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
    app/           # Configuración de rutas y providers
    modules/       # Módulos de dominio (auth, home, cart)
    shared/        # Componentes, hooks y utilidades reutilizables
    assets/        # Imágenes, estilos y datos estáticos
    test/          # Configuración de pruebas
```

## Tecnologías usadas
- React 19
- TypeScript
- Vite
- react-router-dom
- Context API
- Vitest + Testing Library

## Instalación y uso
1. Clona el repositorio
2. Instala dependencias:
   ```
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```
   npm run dev
   ```
4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

## Notas de evaluación
- No se usan librerías de UI ni utilitarios externos (solo fetch API, sin axios)
- No se usa Redux
- El código es 100% TypeScript, sin `any`
- El diseño es propio y puede ser personalizado
- Cada componente, hook, utilidad y página tiene su test unitario

## Autora
Rosario Garcia

---

> Proyecto realizado para el Bootcamp Frontend NTT DATA 2025.
