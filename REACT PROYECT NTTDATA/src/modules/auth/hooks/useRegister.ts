// useRegister.ts - Hook for user registration
import { useState } from 'react';
import { registerService } from '../services/auth.service';
import type { RegisterCredentials, RawRegisterResponse } from '../types/auth.types';

interface UseRegisterReturn {
  register: (credentials: RegisterCredentials) => Promise<RawRegisterResponse>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const register = async (credentials: RegisterCredentials): Promise<RawRegisterResponse> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await registerService(credentials);
      setIsSuccess(true);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido durante el registro';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setIsSuccess(false);
    setIsLoading(false);
  };

  return {
    register,
    isLoading,
    error,
    isSuccess,
    reset,
  };
}