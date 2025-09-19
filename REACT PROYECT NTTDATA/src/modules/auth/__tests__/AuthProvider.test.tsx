// AuthProvider.test.tsx - Unit tests for AuthProvider component
import '@testing-library/jest-dom';
import { render, screen, act, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/modules/auth/context/AuthProvider';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { loginService } from '@/modules/auth/services/auth.service';
import type { User, AuthCredentials } from '@/modules/auth/types/auth.types';

// Mock dependencies
jest.mock('@/modules/auth/services/auth.service');

const mockLoginService = loginService as jest.MockedFunction<typeof loginService>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Test component that uses useAuth hook
function TestComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div>
      <div data-testid="user-info">
        {user ? `${user.username} - ${user.email}` : 'No user'}
      </div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      <button 
        onClick={() => login({ username: 'test', password: 'test' })}
        data-testid="login-button"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
}

describe('AuthProvider Component', () => {
  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    accessToken: 'token123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.removeItem.mockClear();
  });

  describe('Initial State', () => {
    it('should render children with initial unauthenticated state', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });

    it('should restore user from localStorage on mount', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('testuser - test@example.com');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('auth:user');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json');

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth:user');
    });

    it('should handle localStorage not being available', () => {
      // Temporarily replace localStorage
      const originalLocalStorage = window.localStorage;
      delete (window as any).localStorage;

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
    });
  });

  describe('Login Function', () => {
    it('should handle successful login', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockLoginService.mockResolvedValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId('login-button');

      await act(async () => {
        loginButton.click();
      });

      expect(mockLoginService).toHaveBeenCalledWith({ username: 'test', password: 'test' });
      expect(screen.getByTestId('user-info')).toHaveTextContent('testuser - test@example.com');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth:user', JSON.stringify(mockUser));
    });

    it('should handle login errors', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const loginError = new Error('Login failed');
      mockLoginService.mockRejectedValue(loginError);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId('login-button');

      // Login should fail, but the error won't be thrown to the UI level
      // since the AuthProvider handles errors internally
      await act(async () => {
        loginButton.click();
        await waitFor(() => {
          // Wait for async operations to complete
        });
      });

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('should handle localStorage not available during login', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockLoginService.mockResolvedValue(mockUser);

      // Temporarily remove localStorage
      const originalLocalStorage = window.localStorage;
      delete (window as any).localStorage;

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId('login-button');

      await act(async () => {
        loginButton.click();
      });

      expect(screen.getByTestId('user-info')).toHaveTextContent('testuser - test@example.com');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
    });
  });

  describe('Logout Function', () => {
    it('should handle logout correctly', async () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initially authenticated
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');

      const logoutButton = screen.getByTestId('logout-button');

      act(() => {
        logoutButton.click();
      });

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth:user');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
    });

    it('should handle logout when localStorage not available', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Remove localStorage temporarily
      const originalLocalStorage = window.localStorage;
      delete (window as any).localStorage;

      const logoutButton = screen.getByTestId('logout-button');

      act(() => {
        logoutButton.click();
      });

      expect(screen.getByTestId('user-info')).toHaveTextContent('No user');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');

      // Restore localStorage
      Object.defineProperty(window, 'localStorage', { value: originalLocalStorage });
    });

    it('should clear all auth-related localStorage items', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const logoutButton = screen.getByTestId('logout-button');

      act(() => {
        logoutButton.click();
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('auth:user');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('accessToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('State Management', () => {
    it('should update isAuthenticated based on user state', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { unmount } = render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Initially not authenticated
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');

      unmount();

      // After setting user (simulated by re-render with user in localStorage)
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      // Re-render to trigger useEffect
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    it('should provide stable function references', () => {
      let loginRef: ((credentials: AuthCredentials) => Promise<void>) | null = null;
      let logoutRef: (() => void) | null = null;

      function TestStability() {
        const { login, logout } = useAuth();
        
        if (!loginRef) {
          loginRef = login;
          logoutRef = logout;
        } else {
          expect(login).toBe(loginRef);
          expect(logout).toBe(logoutRef);
        }

        return <div>Test</div>;
      }

      const { rerender } = render(
        <AuthProvider>
          <TestStability />
        </AuthProvider>
      );

      rerender(
        <AuthProvider>
          <TestStability />
        </AuthProvider>
      );
    });
  });

  describe('Context Value', () => {
    it('should provide all required context properties', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      function TestContextValue() {
        const context = useAuth();
        
        return (
          <div>
            <div data-testid="has-user">{context.user ? 'true' : 'false'}</div>
            <div data-testid="has-login">{typeof context.login === 'function' ? 'true' : 'false'}</div>
            <div data-testid="has-logout">{typeof context.logout === 'function' ? 'true' : 'false'}</div>
            <div data-testid="has-auth">{typeof context.isAuthenticated === 'boolean' ? 'true' : 'false'}</div>
          </div>
        );
      }

      render(
        <AuthProvider>
          <TestContextValue />
        </AuthProvider>
      );

      expect(screen.getByTestId('has-user')).toHaveTextContent('false');
      expect(screen.getByTestId('has-login')).toHaveTextContent('true');
      expect(screen.getByTestId('has-logout')).toHaveTextContent('true');
      expect(screen.getByTestId('has-auth')).toHaveTextContent('true');
    });

    it('should update context value when user changes', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockLoginService.mockResolvedValue(mockUser);

      function TestUserChange() {
        const { user, login, isAuthenticated } = useAuth();
        
        return (
          <div>
            <div data-testid="current-user">{user?.username || 'none'}</div>
            <div data-testid="is-auth">{isAuthenticated.toString()}</div>
            <button onClick={() => login({ username: 'test', password: 'test' })}>
              Login
            </button>
          </div>
        );
      }

      render(
        <AuthProvider>
          <TestUserChange />
        </AuthProvider>
      );

      expect(screen.getByTestId('current-user')).toHaveTextContent('none');
      expect(screen.getByTestId('is-auth')).toHaveTextContent('false');

      const loginButton = screen.getByRole('button');

      await act(async () => {
        loginButton.click();
      });

      expect(screen.getByTestId('current-user')).toHaveTextContent('testuser');
      expect(screen.getByTestId('is-auth')).toHaveTextContent('true');
    });
  });

  describe('Multiple Children', () => {
    it('should provide same context to multiple children', () => {
      function FirstChild() {
        const { isAuthenticated } = useAuth();
        return <div data-testid="first-child">{isAuthenticated.toString()}</div>;
      }

      function SecondChild() {
        const { isAuthenticated } = useAuth();
        return <div data-testid="second-child">{isAuthenticated.toString()}</div>;
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));

      render(
        <AuthProvider>
          <FirstChild />
          <SecondChild />
        </AuthProvider>
      );

      expect(screen.getByTestId('first-child')).toHaveTextContent('true');
      expect(screen.getByTestId('second-child')).toHaveTextContent('true');
    });
  });

  describe('Edge Cases', () => {
    it('should handle login with different user data', async () => {
      const differentUser: User = {
        id: 2,
        username: 'otheruser',
        email: 'other@example.com',
        firstName: 'Other',
        lastName: 'User',
        accessToken: 'other-token',
      };

      mockLocalStorage.getItem.mockReturnValue(null);
      mockLoginService.mockResolvedValue(differentUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId('login-button');

      await act(async () => {
        loginButton.click();
      });

      expect(screen.getByTestId('user-info')).toHaveTextContent('otheruser - other@example.com');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('auth:user', JSON.stringify(differentUser));
    });

    it('should handle rapid login/logout cycles', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockLoginService.mockResolvedValue(mockUser);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      const loginButton = screen.getByTestId('login-button');
      const logoutButton = screen.getByTestId('logout-button');

      // Login
      await act(async () => {
        loginButton.click();
      });

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');

      // Logout
      act(() => {
        logoutButton.click();
      });

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');

      // Login again
      await act(async () => {
        loginButton.click();
      });

      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });
  });
});