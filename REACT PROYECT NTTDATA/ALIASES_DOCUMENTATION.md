# Path Aliases Configuration

Este proyecto ahora incluye configuración de path aliases para simplificar los imports.

## Configuración

### TypeScript (`tsconfig.json` y `tsconfig.app.json`)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Vite (`vite.config.ts`)
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  }
})
```

## Uso

### Antes (imports relativos)
```typescript
import { AuthProvider } from '../../modules/auth/context/AuthProvider';
import { ROUTES } from '../../shared/constants/routes';
import { Header } from '../shared/components/layout/Header';
```

### Después (usando aliases)
```typescript
import { AuthProvider } from '@/modules/auth/context/AuthProvider';
import { ROUTES } from '@/shared/constants/routes';
import { Header } from '@/shared/components/layout/Header';
```

## Beneficios

1. **Imports más limpios**: No más `../../../`
2. **Refactoring más fácil**: Los imports no se rompen al mover archivos
3. **Mejor legibilidad**: Paths absolutos desde la raíz del proyecto
4. **IntelliSense mejorado**: VS Code puede autocompletar mejor los paths

## Estructura recomendada con aliases

```
src/
├── @/app/          → Configuración de la aplicación
├── @/modules/      → Módulos de funcionalidad
├── @/shared/       → Componentes y utilities compartidos
├── @/assets/       → Recursos estáticos
└── @/test/         → Configuración de tests
```