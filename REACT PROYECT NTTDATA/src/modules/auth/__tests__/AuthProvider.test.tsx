// AuthProvider.test.tsx - Tests de integración para AuthProvider
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/modules/auth/context/AuthProvider';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { loginService } from '@/modules/auth/services/auth.service';

// Mock del servicio de auth
vi.mock('@/modules/auth/services/auth.service', () => ({
  loginService: vi.fn(),
}));

// Componente de prueba para testear el contexto
function TestComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ username: 'test', password: 'test' });
    } catch {
      // Error será manejado por el contexto
    }
  };

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'authenticated' : 'not-authenticated'}
      </div>
      {user && (
        <div data-testid="user-info">
          {user.username} - {user.email}
        </div>
      )}
      <button onClick={handleLogin} data-testid="login-button">
        Login
      </button>
      <button onClick={logout} data-testid="logout-button">
        Logout
      </button>
    </div>
  );
}

const MockWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('AuthProvider Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  describe('Estado inicial', () => {
    it('should provide initial unauthenticated state', () => {
      render(
        <MockWrapper>
          <TestComponent />
        </MockWrapper>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    });

    it('should restore user from localStorage if available', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        accessToken: 'fake-token'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('accessToken', 'fake-token');

      render(
        <MockWrapper>
          <TestComponent />
        </MockWrapper>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('testuser - test@example.com');
    });
  });

  describe('Login process', () => {
    it('should handle successful login', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        id: 1,
        username: 'emilys',
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily@test.com',
        accessToken: 'fake-token'
      };

      vi.mocked(loginService).mockResolvedValue(mockResponse);

      render(
        <MockWrapper>
          <TestComponent />
        </MockWrapper>
      );

      const loginButton = screen.getByTestId('login-button');
      await user.click(loginButton);

      // Esperar a que termine el login
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      });
      expect(screen.getByTestId('user-info')).toHaveTextContent('emilys - emily@test.com');
      
      // Verificar que se guardó en localStorage
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse));
      expect(localStorage.getItem('accessToken')).toBe(mockResponse.accessToken);
    });

    it('should handle login failure', async () => {
      const user = userEvent.setup();
      vi.mocked(loginService).mockRejectedValue(new Error('Invalid credentials'));

      render(
        <MockWrapper>
          <TestComponent />
        </MockWrapper>
      );

      const loginButton = screen.getByTestId('login-button');
      await user.click(loginButton);

      // Esperar a que termine el login
      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      });

      // Debe mantenerse no autenticado
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
      
      // No debe guardar nada en localStorage
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('Logout process', () => {
    it('should handle logout correctly', async () => {
      const user = userEvent.setup();
      
      // Configurar estado inicial con usuario autenticado
      const mockUser = {
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        accessToken: 'fake-token'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('accessToken', 'fake-token');

      render(
        <MockWrapper>
          <TestComponent />
        </MockWrapper>
      );

      // Verificar estado inicial autenticado
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');

      const logoutButton = screen.getByTestId('logout-button');
      await user.click(logoutButton);

      // Verificar que se desautenticó
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
      
      // Verificar que se limpió localStorage
      expect(localStorage.getItem('user')).toBeNull();
      expect(localStorage.getItem('accessToken')).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should throw error when useAuth is used outside AuthProvider', () => {
      // Capturar errores de consola para el test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Persistent state', () => {
    it('should maintain authentication across re-renders', () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        accessToken: 'fake-token'
      };
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('accessToken', 'fake-token');

      const { rerender } = render(
        <MockWrapper>
          <TestComponent />
        </MockWrapper>
      );

      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');

      // Re-render del componente
      rerender(
        <MockWrapper>
          <TestComponent />
        </MockWrapper>
      );

      // Debe mantener el estado
      expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
      expect(screen.getByTestId('user-info')).toHaveTextContent('testuser - test@example.com');
    });

    it('should handle corrupted localStorage data gracefully', () => {
      // Configurar datos corruptos en localStorage
      localStorage.setItem('user', 'invalid-json');
      localStorage.setItem('accessToken', 'some-token');

      render(
        <MockWrapper>
          <TestComponent />
        </MockWrapper>
      );

      // Debe manejar graciosamente los datos corruptos
      expect(screen.getByTestId('auth-status')).toHaveTextContent('not-authenticated');
      expect(screen.queryByTestId('user-info')).not.toBeInTheDocument();
    });
  });
});