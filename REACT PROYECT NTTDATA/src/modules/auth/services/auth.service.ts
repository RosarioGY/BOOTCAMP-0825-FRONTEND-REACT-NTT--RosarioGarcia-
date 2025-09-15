// auth.service.ts - Authentication service
import { loginUser, getUserProfile, refreshAccessToken, isTokenExpired, logoutUser, registerUser } from '@/api/Auth';
import type { AuthCredentials, User, RegisterCredentials, RawRegisterResponse } from '@/modules/auth/types/auth.types';
import { mapAuthResponse, mapUserProfileResponse } from '@/modules/auth/mappers/auth.mappers';

export async function loginService(credentials: AuthCredentials): Promise<User> {
  const response = await loginUser({
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 60
  });
  
  // Guardamos los tokens en localStorage para uso posterior
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  
  return mapAuthResponse(response);
}

export async function getProfileService(accessToken: string): Promise<User> {
  const profile = await getUserProfile(accessToken);
  return mapUserProfileResponse(profile, accessToken);
}

export async function refreshTokenService(): Promise<string> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }
  
  const response = await refreshAccessToken({ refreshToken });
  
  // Actualizamos los tokens en localStorage
  localStorage.setItem('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  
  return response.accessToken;
}

export function checkTokenExpiration(): boolean {
  const token = localStorage.getItem('accessToken');
  if (!token) return true;
  
  return isTokenExpired(token);
}

export function logoutService(): void {
  logoutUser();
}

export async function registerService(credentials: RegisterCredentials): Promise<RawRegisterResponse> {
  const response = await registerUser({
    firstName: credentials.firstName,
    lastName: credentials.lastName,
    username: credentials.username,
    email: credentials.email,
    password: credentials.password,
    age: credentials.age,
    gender: credentials.gender,
  });
  
  return response;
}
