# API de Autenticación - Funciones Exportables

## Funciones disponibles en `src/api/Auth.ts`

### 1. `loginUser(credentials)`
Función para iniciar sesión con DummyJSON API.

```typescript
import { loginUser } from './src/api/Auth';

const credentials = {
  username: 'emilys',
  password: 'emilyspass',
  expiresInMins: 60 // opcional, por defecto 60
};

try {
  const result = await loginUser(credentials);
  console.log('Login exitoso:', result);
  // result contiene: id, username, email, firstName, lastName, gender, image, accessToken, refreshToken
} catch (error) {
  console.error('Error en login:', error.message);
}
```

### 2. `getUserProfile(accessToken)`
Función para obtener el perfil del usuario autenticado.

```typescript
import { getUserProfile } from './src/api/Auth';

try {
  const profile = await getUserProfile('your-access-token-here');
  console.log('Perfil del usuario:', profile);
} catch (error) {
  console.error('Error al obtener perfil:', error.message);
}
```

### 3. `refreshAccessToken(refreshData)`
Función para renovar el token de acceso.

```typescript
import { refreshAccessToken } from './src/api/Auth';

try {
  const newTokens = await refreshAccessToken({
    refreshToken: 'your-refresh-token-here', // opcional si se usa cookie
    expiresInMins: 60 // opcional
  });
  console.log('Tokens renovados:', newTokens);
} catch (error) {
  console.error('Error al refrescar token:', error.message);
}
```

### 4. `isTokenExpired(token)`
Función para verificar si un JWT token está expirado.

```typescript
import { isTokenExpired } from './src/api/Auth';

const token = 'your-jwt-token-here';
if (isTokenExpired(token)) {
  console.log('Token expirado, necesita renovación');
} else {
  console.log('Token válido');
}
```

### 5. `logoutUser()`
Función para cerrar sesión (limpia tokens del localStorage).

```typescript
import { logoutUser } from './src/api/Auth';

logoutUser();
console.log('Sesión cerrada, tokens eliminados');
```

## Credenciales de prueba (DummyJSON)

Para probar las funciones, puedes usar estas credenciales válidas:

```typescript
// Usuario 1
{
  username: 'emilys',
  password: 'emilyspass'
}

// Usuario 2  
{
  username: 'michaelw',
  password: 'michaelwpass'
}

// Usuario 3
{
  username: 'sophiab',
  password: 'sophiabpass'
}
```

## Integración con el sistema de autenticación

Las funciones están integradas en:

- **Servicio**: `src/modules/auth/services/auth.service.ts`
- **Context**: `src/modules/auth/context/AuthContext.tsx`
- **Hook personalizado**: `src/modules/auth/hooks/useLogin.ts`
- **Componente**: `src/modules/auth/components/LoginForm.tsx`

## Flujo de autenticación completo

1. El usuario ingresa credenciales en `LoginForm`
2. Se llama a `loginUser()` desde el servicio
3. Los tokens se guardan en localStorage
4. El usuario se almacena en el AuthContext
5. Se redirige a la página protegida
6. El `withAuthGuard` HOC protege las rutas
7. Si el token expira, se renueva automáticamente con `refreshAccessToken()`