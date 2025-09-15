// useLogin.ts - Login custom hook
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { checkTokenExpiration, refreshTokenService } from '../services/auth.service';
import { ROUTES } from '../../../shared/constants/routes';
import type { AuthCredentials } from '../types/auth.types';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, logout, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      await login(credentials);
      navigate(ROUTES.home, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de autenticación';
      setError(errorMessage);
      throw err; // Re-throw para que el componente pueda manejarlo si es necesario
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  const checkAndRefreshToken = async (): Promise<boolean> => {
    if (!isAuthenticated) return false;

    try {
      if (checkTokenExpiration()) {
        await refreshTokenService();
        return true;
      }
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      handleLogout();
      return false;
    }
  };

  return {
    // Estado
    isLoading,
    error,
    user,
    isAuthenticated,
    
    // Acciones
    login: handleLogin,
    logout: handleLogout,
    checkAndRefreshToken,
    clearError: () => setError(null),
  };
}

// Hook para verificación automática de token
export function useTokenValidation() {
  const { checkAndRefreshToken } = useLogin();

  const validateToken = async () => {
    return await checkAndRefreshToken();
  };

  return { validateToken };
}