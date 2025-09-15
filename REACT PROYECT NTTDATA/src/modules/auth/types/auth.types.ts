// auth.types.ts - Authentication types
export interface AuthCredentials {
  username: string;
  password: string;
}

// Respuesta de la API de DummyJSON para login
export interface RawAuthResponse {
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

// Respuesta de la API para el perfil del usuario
export interface RawUserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

// Tipo interno para el usuario en nuestra aplicación
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  image?: string;
  accessToken: string;
  refreshToken?: string;
}

// Tipos para el registro de usuarios
export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  age: number;
  gender?: string;
}

// Respuesta de la API de DummyJSON para registro
export interface RawRegisterResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  age: number;
  gender?: string;
  image?: string;
}

// Tipo para datos de usuario a registrar (para API)
export interface RegisterUserData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  age: number;
  gender?: string;
}
