// Auth.ts - Mock API for authentication
import type { RawAuthResponse, RawUserProfile, RegisterCredentials, RawRegisterResponse } from '@/modules/auth/types/auth.types';

export interface LoginCredentialsWithExpiry {
  username: string;
  password: string;
  expiresInMins: number;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Simulamos funciones de API para que los tests puedan funcionar
export const loginUser = async (credentials: LoginCredentialsWithExpiry): Promise<RawAuthResponse> => {
  // Simulación de login usando RawAuthResponse para coincidir con mappers
  return {
    id: 1,
    username: credentials.username,
    firstName: 'Mock',
    lastName: 'User',
    email: `${credentials.username}@mock.com`,
    gender: 'male',
    image: 'https://via.placeholder.com/150',
    accessToken: 'mock_access_token',
    refreshToken: 'mock_refresh_token'
  };
};

export const getUserProfile = async (): Promise<RawUserProfile> => {
  // Simulación de obtener perfil usando RawUserProfile
  return {
    id: 1,
    username: 'mockuser',
    firstName: 'Mock',
    lastName: 'User',
    email: 'test@example.com',
    gender: 'male',
    image: 'https://via.placeholder.com/150'
  };
};

export const refreshAccessToken = async (request: RefreshRequest): Promise<RefreshResponse> => {
  // Simulación de refresh token
  return {
    accessToken: 'new_mock_access_token',
    refreshToken: request.refreshToken // Devolvemos el mismo refresh token
  };
};

export const registerUser = async (data: RegisterCredentials): Promise<RawRegisterResponse> => {
  // Simulación de registro
  return {
    id: 2,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    age: data.age,
    gender: data.gender || 'male', // valor por defecto
    image: 'https://via.placeholder.com/150'
  };
};

export const isTokenExpired = (token: string): boolean => {
  // Simulación simple de validación de token
  return token === 'expired_token';
};

export const logoutUser = async (): Promise<void> => {
  // Simulación de logout
  return;
};