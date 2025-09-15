// fetchClient.ts - wrapper de fetch con manejo de errores
import { HttpError } from './http';
import { API } from '@/shared/constants/api';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API.baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new HttpError(res.status, text || 'Algo salió mal, inténtelo más tarde');
  }
  return res.json() as Promise<T>;
}
