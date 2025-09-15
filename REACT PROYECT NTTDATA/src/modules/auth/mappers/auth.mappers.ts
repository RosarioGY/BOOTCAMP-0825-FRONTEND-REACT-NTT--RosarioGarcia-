// auth.mappers.ts - Authentication mappers
import type { RawAuthResponse, RawUserProfile, User } from '@/modules/auth/types/auth.types';

// Mapper para la respuesta de login
export const mapAuthResponse = (raw: RawAuthResponse): User => ({
  id: raw.id,
  username: raw.username,
  firstName: raw.firstName,
  lastName: raw.lastName,
  email: raw.email,
  gender: raw.gender,
  image: raw.image,
  accessToken: raw.accessToken,
  refreshToken: raw.refreshToken,
});

// Mapper para el perfil del usuario (cuando solo necesitamos datos del perfil)
export const mapUserProfileResponse = (raw: RawUserProfile, accessToken: string): User => ({
  id: raw.id,
  username: raw.username,
  firstName: raw.firstName,
  lastName: raw.lastName,
  email: raw.email,
  gender: raw.gender,
  image: raw.image,
  accessToken: accessToken,
});
