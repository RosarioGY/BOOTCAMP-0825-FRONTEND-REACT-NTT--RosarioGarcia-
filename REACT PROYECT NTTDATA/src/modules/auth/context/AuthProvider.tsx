// AuthProvider.tsx - Authentication provider component
import { useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthCredentials } from '@/modules/auth/types/auth.types';
import { AuthContext, type AuthContextValue } from '@/modules/auth/context/AuthContext';
import { loginService } from '@/modules/auth/services/auth.service';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const cached = localStorage.getItem('auth:user');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        localStorage.removeItem('auth:user');
      }
    }
  }, []);

  const login = async (credentials: AuthCredentials) => {
    const userData = await loginService(credentials);
    setUser(userData);
    localStorage.setItem('auth:user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth:user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const value: AuthContextValue = useMemo(
    () => ({ user, login, logout, isAuthenticated: !!user }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}