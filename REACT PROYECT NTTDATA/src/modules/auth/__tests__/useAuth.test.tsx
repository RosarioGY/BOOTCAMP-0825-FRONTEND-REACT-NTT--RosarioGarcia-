// useAuth.test.tsx - Unit tests for useAuth hook
import { renderHook } from '@testing-library/react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { AuthContext, type AuthContextValue } from '@/modules/auth/context/AuthContext';
import type { ReactNode } from 'react';

// Mock context value
const mockContextValue = {
  user: {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    accessToken: 'token123',
  },
  login: jest.fn(),
  logout: jest.fn(),
  isAuthenticated: true,
};

// Wrapper component with AuthContext
const createWrapper = (contextValue: AuthContextValue | null) => {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AuthContext.Provider value={contextValue || undefined}>
        {children}
      </AuthContext.Provider>
    );
  };
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should return context value when used within AuthProvider', () => {
      const wrapper = createWrapper(mockContextValue);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toBe(mockContextValue);
      expect(result.current.user).toBe(mockContextValue.user);
      expect(result.current.login).toBe(mockContextValue.login);
      expect(result.current.logout).toBe(mockContextValue.logout);
      expect(result.current.isAuthenticated).toBe(mockContextValue.isAuthenticated);
    });

    it('should return updated context value when context changes', () => {
      const initialWrapper = createWrapper(mockContextValue);
      const { result, unmount } = renderHook(() => useAuth(), { wrapper: initialWrapper });

      expect(result.current.isAuthenticated).toBe(true);

      unmount();

      // Test with updated context value
      const updatedContextValue = {
        ...mockContextValue,
        user: null,
        isAuthenticated: false,
      };

      const updatedWrapper = createWrapper(updatedContextValue);
      const { result: newResult } = renderHook(() => useAuth(), { wrapper: updatedWrapper });

      expect(newResult.current.isAuthenticated).toBe(false);
      expect(newResult.current.user).toBe(null);
    });

    it('should provide access to login function', () => {
      const wrapper = createWrapper(mockContextValue);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.login).toBe('function');
      expect(result.current.login).toBe(mockContextValue.login);
    });

    it('should provide access to logout function', () => {
      const wrapper = createWrapper(mockContextValue);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(typeof result.current.logout).toBe('function');
      expect(result.current.logout).toBe(mockContextValue.logout);
    });
  });

  describe('Error Cases', () => {
    it('should throw error when used outside AuthProvider', () => {
      const wrapper = createWrapper(null);
      
      expect(() => {
        renderHook(() => useAuth(), { wrapper });
      }).toThrow('useAuth must be used within an AuthProvider');
    });

    it('should throw error when AuthContext is undefined', () => {
      // Test without any wrapper (context will be undefined)
      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth must be used within an AuthProvider');
    });
  });

  describe('Context Properties', () => {
    it('should provide all expected context properties', () => {
      const wrapper = createWrapper(mockContextValue);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('isAuthenticated');
    });

    it('should handle null user correctly', () => {
      const contextWithNullUser = {
        ...mockContextValue,
        user: null,
        isAuthenticated: false,
      };

      const wrapper = createWrapper(contextWithNullUser);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBe(null);
      expect(result.current.isAuthenticated).toBe(false);
    });

    it('should handle different user objects', () => {
      const differentUser = {
        id: 2,
        username: 'anotheruser',
        email: 'another@example.com',
        firstName: 'Another',
        lastName: 'User',
        accessToken: 'differenttoken',
      };

      const contextWithDifferentUser = {
        ...mockContextValue,
        user: differentUser,
      };

      const wrapper = createWrapper(contextWithDifferentUser);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user).toBe(differentUser);
      expect(result.current.user?.username).toBe('anotheruser');
      expect(result.current.user?.email).toBe('another@example.com');
    });
  });

  describe('Function References', () => {
    it('should maintain stable function references', () => {
      const wrapper = createWrapper(mockContextValue);
      const { result, rerender } = renderHook(() => useAuth(), { wrapper });

      const initialLogin = result.current.login;
      const initialLogout = result.current.logout;

      // Re-render with same context
      rerender();

      expect(result.current.login).toBe(initialLogin);
      expect(result.current.logout).toBe(initialLogout);
    });
  });

  describe('Integration', () => {
    it('should work with realistic context values', () => {
      const realisticContext = {
        user: {
          id: 12345,
          username: 'john_doe',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        login: jest.fn().mockResolvedValue(undefined),
        logout: jest.fn(),
        isAuthenticated: true,
      };

      const wrapper = createWrapper(realisticContext);
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.user?.id).toBe(12345);
      expect(result.current.user?.username).toBe('john_doe');
      expect(result.current.isAuthenticated).toBe(true);
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.logout).toBe('function');
    });

    it('should handle authentication state transitions', () => {
      // Test unauthenticated state
      const unauthenticatedContext = {
        user: null,
        login: jest.fn(),
        logout: jest.fn(),
        isAuthenticated: false,
      };

      const initialWrapper = createWrapper(unauthenticatedContext);
      const { result: unauthResult } = renderHook(() => useAuth(), { wrapper: initialWrapper });

      expect(unauthResult.current.isAuthenticated).toBe(false);
      expect(unauthResult.current.user).toBe(null);

      // Test authenticated state separately
      const authenticatedContext = {
        user: mockContextValue.user,
        login: jest.fn(),
        logout: jest.fn(),
        isAuthenticated: true,
      };

      const authenticatedWrapper = createWrapper(authenticatedContext);
      const { result: authResult } = renderHook(() => useAuth(), { wrapper: authenticatedWrapper });

      expect(authResult.current.isAuthenticated).toBe(true);
      expect(authResult.current.user).toBe(mockContextValue.user);
    });
  });
});