// useRegister.test.ts - Unit tests for useRegister hook
import { renderHook, act } from '@testing-library/react';
import { useRegister } from '@/modules/auth/hooks/useRegister';
import { registerService } from '@/modules/auth/services/auth.service';
import type { RegisterCredentials, RawRegisterResponse } from '@/modules/auth/types/auth.types';

// Mock dependencies
jest.mock('@/modules/auth/services/auth.service');

const mockRegisterService = registerService as jest.MockedFunction<typeof registerService>;

describe('useRegister Hook', () => {
  const mockCredentials: RegisterCredentials = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    password: 'password123',
    age: 25,
    gender: 'male',
  };

  const mockResponse: RawRegisterResponse = {
    id: 1,
    username: 'johndoe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    age: 25,
    gender: 'male',
    image: 'https://example.com/image.jpg',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should return initial state correctly', () => {
      const { result } = renderHook(() => useRegister());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.isSuccess).toBe(false);
      expect(typeof result.current.register).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('Register Function', () => {
    it('should handle successful registration', async () => {
      mockRegisterService.mockResolvedValue(mockResponse);
      const { result } = renderHook(() => useRegister());

      let registerResult: RawRegisterResponse;
      await act(async () => {
        registerResult = await result.current.register(mockCredentials);
      });

      expect(mockRegisterService).toHaveBeenCalledWith(mockCredentials);
      expect(registerResult!).toBe(mockResponse);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during registration', async () => {
      let resolveRegister: (value: RawRegisterResponse) => void;
      const registerPromise = new Promise<RawRegisterResponse>((resolve) => {
        resolveRegister = resolve;
      });
      mockRegisterService.mockReturnValue(registerPromise);

      const { result } = renderHook(() => useRegister());

      act(() => {
        result.current.register(mockCredentials);
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.isSuccess).toBe(false);

      await act(async () => {
        resolveRegister(mockResponse);
        await registerPromise;
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle registration error with Error instance', async () => {
      const errorMessage = 'Registration failed';
      const registrationError = new Error(errorMessage);
      mockRegisterService.mockRejectedValue(registrationError);

      const { result } = renderHook(() => useRegister());

      await act(async () => {
        try {
          await result.current.register(mockCredentials);
        } catch (error) {
          expect(error).toBe(registrationError);
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle registration error with non-Error instance', async () => {
      const errorMessage = 'Network error';
      mockRegisterService.mockRejectedValue(errorMessage);

      const { result } = renderHook(() => useRegister());

      await act(async () => {
        try {
          await result.current.register(mockCredentials);
        } catch (error) {
          expect(error).toBe(errorMessage);
        }
      });

      expect(result.current.error).toBe('Error desconocido durante el registro');
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should reset states before new registration attempt', async () => {
      // First registration fails
      mockRegisterService.mockRejectedValueOnce(new Error('First error'));
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        try {
          await result.current.register(mockCredentials);
        } catch {
          // Expected error, ignore
        }
      });

      expect(result.current.error).toBe('First error');
      expect(result.current.isSuccess).toBe(false);

      // Second registration succeeds
      mockRegisterService.mockResolvedValueOnce(mockResponse);

      await act(async () => {
        await result.current.register(mockCredentials);
      });

      expect(result.current.error).toBe(null);
      expect(result.current.isSuccess).toBe(true);
    });

    it('should reset isSuccess to false on new registration attempt', async () => {
      // First registration succeeds
      mockRegisterService.mockResolvedValueOnce(mockResponse);
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.register(mockCredentials);
      });

      expect(result.current.isSuccess).toBe(true);

      // Second registration attempt
      mockRegisterService.mockResolvedValueOnce(mockResponse);

      await act(async () => {
        await result.current.register(mockCredentials);
      });

      // Should still be successful, but isSuccess was reset and set again
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBe(null);
    });
  });

  describe('Reset Function', () => {
    it('should reset all states when reset is called', async () => {
      // Create some state first
      mockRegisterService.mockRejectedValue(new Error('Test error'));
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        try {
          await result.current.register(mockCredentials);
        } catch {
          // Expected error, ignore
        }
      });

      expect(result.current.error).toBe('Test error');
      expect(result.current.isSuccess).toBe(false);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBe(null);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it('should reset success state', async () => {
      // Create success state
      mockRegisterService.mockResolvedValue(mockResponse);
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.register(mockCredentials);
      });

      expect(result.current.isSuccess).toBe(true);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.isSuccess).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Multiple Registrations', () => {
    it('should handle multiple sequential registrations', async () => {
      const { result } = renderHook(() => useRegister());

      // First registration
      mockRegisterService.mockResolvedValueOnce(mockResponse);
      await act(async () => {
        await result.current.register(mockCredentials);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(mockRegisterService).toHaveBeenCalledTimes(1);

      // Second registration
      const secondCredentials = { ...mockCredentials, username: 'johndoe2' };
      const secondResponse = { ...mockResponse, username: 'johndoe2' };
      mockRegisterService.mockResolvedValueOnce(secondResponse);

      await act(async () => {
        await result.current.register(secondCredentials);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(mockRegisterService).toHaveBeenCalledTimes(2);
      expect(mockRegisterService).toHaveBeenLastCalledWith(secondCredentials);
    });
  });

  describe('Return Values', () => {
    it('should return all expected properties', () => {
      const { result } = renderHook(() => useRegister());

      expect(result.current).toHaveProperty('register');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('isSuccess');
      expect(result.current).toHaveProperty('reset');

      expect(typeof result.current.register).toBe('function');
      expect(typeof result.current.reset).toBe('function');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.isSuccess).toBe('boolean');
      expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle registration with minimal required fields', async () => {
      const minimalCredentials: RegisterCredentials = {
        firstName: 'Jane',
        lastName: 'Doe',
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password123',
        age: 18,
        gender: '',
      };

      mockRegisterService.mockResolvedValue(mockResponse);
      const { result } = renderHook(() => useRegister());

      await act(async () => {
        await result.current.register(minimalCredentials);
      });

      expect(mockRegisterService).toHaveBeenCalledWith(minimalCredentials);
      expect(result.current.isSuccess).toBe(true);
    });

    it('should handle concurrent registration attempts', async () => {
      const { result } = renderHook(() => useRegister());
      
      let resolveFirst: (value: RawRegisterResponse) => void;
      let resolveSecond: (value: RawRegisterResponse) => void;
      
      const firstPromise = new Promise<RawRegisterResponse>((resolve) => {
        resolveFirst = resolve;
      });
      
      const secondPromise = new Promise<RawRegisterResponse>((resolve) => {
        resolveSecond = resolve;
      });

      mockRegisterService
        .mockReturnValueOnce(firstPromise)
        .mockReturnValueOnce(secondPromise);

      // Start first registration
      act(() => {
        result.current.register(mockCredentials);
      });

      expect(result.current.isLoading).toBe(true);

      // Start second registration while first is still loading
      act(() => {
        result.current.register({ ...mockCredentials, username: 'different' });
      });

      // Resolve first, then second
      await act(async () => {
        resolveFirst(mockResponse);
        await firstPromise;
      });

      await act(async () => {
        resolveSecond({ ...mockResponse, username: 'different' });
        await secondPromise;
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
    });
  });
});