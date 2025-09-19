// AuthProvider.tsx - Authentication provider component
import { useMemo, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthCredentials } from '@/modules/auth/types/auth.types';
import { AuthContext, type AuthContextValue } from '@/modules/auth/context/AuthContext';
import { loginService } from '@/modules/auth/services/auth.service';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar si localStorage está disponible
    if (typeof localStorage !== 'undefined') {
      const cached = localStorage.getItem('auth:user');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          localStorage.removeItem('auth:user');
        }
      }
    }
  }, []);

  const login = useCallback(async (credentials: AuthCredentials) => {
    try {
      const userData = await loginService(credentials);
      setUser(userData);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('auth:user', JSON.stringify(userData));
      }
    } catch (error) {
      // Handle login errors silently - error handling is done at the UI level
      console.error('Login failed:', error);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('auth:user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }, []);

  const value: AuthContextValue = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}