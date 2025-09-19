// useLogin.test.ts - Unit tests for useLogin hook
import { renderHook, act } from '@testing-library/react';
import { useLogin, useTokenValidation } from '@/modules/auth/hooks/useLogin';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { checkTokenExpiration, refreshTokenService } from '@/modules/auth/services/auth.service';
import { ROUTES } from '@/shared/constants/routes';

// Mock dependencies
jest.mock('@/modules/auth/hooks/useAuth');
jest.mock('@/modules/auth/services/auth.service');

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockCheckTokenExpiration = checkTokenExpiration as jest.MockedFunction<typeof checkTokenExpiration>;
const mockRefreshTokenService = refreshTokenService as jest.MockedFunction<typeof refreshTokenService>;
const mockNavigate = jest.fn();

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('useLogin Hook', () => {
  const mockLogin = jest.fn();
  const mockLogout = jest.fn();
  const mockUser = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    accessToken: 'token123',
  };

  const defaultAuthMock = {
    login: mockLogin,
    logout: mockLogout,
    user: null,
    isAuthenticated: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue(defaultAuthMock);
  });

  describe('Initial State', () => {
    it('should return initial state correctly', () => {
      const { result } = renderHook(() => useLogin());

      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should return user and authentication status from useAuth', () => {
      mockUseAuth.mockReturnValue({
        ...defaultAuthMock,
        user: mockUser,
        isAuthenticated: true,
      });

      const { result } = renderHook(() => useLogin());

      expect(result.current.user).toBe(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Login Function', () => {
    it('should handle successful login', async () => {
      mockLogin.mockResolvedValue(undefined);
      const { result } = renderHook(() => useLogin());

      const credentials = { username: 'testuser', password: 'password123' };

      await act(async () => {
        await result.current.login(credentials);
      });

      expect(mockLogin).toHaveBeenCalledWith(credentials);
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.home, { replace: true });
      expect(result.current.error).toBe(null);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set loading state during login', async () => {
      let resolveLogin: () => void;
      const loginPromise = new Promise<void>((resolve) => {
        resolveLogin = resolve;
      });
      mockLogin.mockReturnValue(loginPromise);

      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.login({ username: 'test', password: 'pass' });
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveLogin();
        await loginPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should handle login error with Error instance', async () => {
      const errorMessage = 'Invalid credentials';
      const loginError = new Error(errorMessage);
      mockLogin.mockRejectedValue(loginError);

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        try {
          await result.current.login({ username: 'test', password: 'pass' });
        } catch (error) {
          expect(error).toBe(loginError);
        }
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle login error with non-Error instance', async () => {
      const errorMessage = 'Network error';
      mockLogin.mockRejectedValue(errorMessage);

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        try {
          await result.current.login({ username: 'test', password: 'pass' });
        } catch (error) {
          expect(error).toBe(errorMessage);
        }
      });

      expect(result.current.error).toBe('Error de autenticación');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Logout Function', () => {
    it('should handle logout correctly', () => {
      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.logout();
      });

      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.login, { replace: true });
    });
  });

  describe('Clear Error Function', () => {
    it('should clear error when clearError is called', async () => {
      mockLogin.mockRejectedValue(new Error('Test error'));
      const { result } = renderHook(() => useLogin());

      // Create error
      await act(async () => {
        try {
          await result.current.login({ username: 'test', password: 'pass' });
        } catch {
          // Expected error, ignore
        }
      });

      expect(result.current.error).toBe('Test error');

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });
});

describe('useTokenValidation Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should validate token using checkAndRefreshToken', async () => {
    mockUseAuth.mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
      isAuthenticated: true,
    });
    mockCheckTokenExpiration.mockReturnValue(false);

    const { result } = renderHook(() => useTokenValidation());

    let validationResult: boolean;
    await act(async () => {
      validationResult = await result.current.validateToken();
    });

    expect(validationResult!).toBe(true);
  });

  it('should return false for invalid token', async () => {
    mockUseAuth.mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      user: null,
      isAuthenticated: false,
    });

    const { result } = renderHook(() => useTokenValidation());

    let validationResult: boolean;
    await act(async () => {
      validationResult = await result.current.validateToken();
    });

    expect(validationResult!).toBe(false);
  });
});