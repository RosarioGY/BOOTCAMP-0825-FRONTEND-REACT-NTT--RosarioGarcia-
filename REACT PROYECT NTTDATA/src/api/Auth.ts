// Auth.ts - Funciones para autenticación con DummyJSON API

// Tipos para las respuestas de la API
export interface LoginCredentials {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
  expiresInMins?: number;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Función para iniciar sesión
 * @param credentials - Credenciales de usuario (username, password)
 * @returns Promise con los datos del usuario y tokens
 */
export async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins || 60,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en el login');
  }

  return response.json();
}

/**
 * Función para obtener el perfil del usuario autenticado
 * @param accessToken - Token de acceso del usuario
 * @returns Promise con los datos del perfil del usuario
 */
export async function getUserProfile(accessToken: string): Promise<UserProfile> {
  const response = await fetch('https://dummyjson.com/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al obtener el perfil');
  }

  return response.json();
}

/**
 * Función para refrescar el token de acceso
 * @param refreshData - Datos para refrescar el token (refreshToken opcional)
 * @returns Promise con los nuevos tokens
 */
export async function refreshAccessToken(refreshData: RefreshTokenRequest = {}): Promise<RefreshTokenResponse> {
  const response = await fetch('https://dummyjson.com/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refreshToken: refreshData.refreshToken, // Optional, if not provided, the server will use the cookie
      expiresInMins: refreshData.expiresInMins || 60,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al refrescar el token');
  }

  return response.json();
}

/**
 * Función para verificar si un token está expirado
 * @param token - JWT token a verificar
 * @returns boolean indicando si el token está expirado
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true; // Si no se puede decodificar, consideramos que está expirado
  }
}

export interface RegisterUserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  age: number;
  gender?: string;
}

export interface RegisterUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  age: number;
  gender?: string;
  image?: string;
}

/**
 * Función para registrar un nuevo usuario
 * @param userData - Datos del usuario a registrar
 * @returns Promise con los datos del usuario registrado
 */
export async function registerUser(userData: RegisterUserData): Promise<RegisterUserResponse> {
  const response = await fetch('https://dummyjson.com/users/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      age: userData.age,
      gender: userData.gender,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en el registro');
  }

  return response.json();
}

/**
 * Función para logout (limpiar tokens locales)
 * Esta función limpia los tokens del localStorage
 */
export function logoutUser(): void {
  localStorage.removeItem('auth:user');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}