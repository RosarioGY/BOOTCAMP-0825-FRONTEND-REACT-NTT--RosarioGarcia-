// AuthProvider.jest.test.tsx - Tests completos con Jest para AuthProvider
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/modules/auth/context/AuthProvider';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { loginService } from '@/modules/auth/services/auth.service';

// Mocks
jest.mock('@/modules/auth/services/auth.service', () => ({
  loginService: jest.fn(),
}));

const mockLoginService = loginService as jest.MockedFunction<typeof loginService>;

// Componente de prueba para usar el contexto
const TestComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login({ username: 'testuser', password: 'testpass' });
    } catch (error) {
      console.log('Login error');
    }
  };
  
  return (
    <div>
      <div data-testid="user-status">
        {user ? `Logged in as ${user.username}` : 'Not logged in'}
      </div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
      </div>
      <button
        onClick={handleLogin}
        data-testid="login-btn"
      >
        Login
      </button>
      <button
        onClick={logout}
        data-testid="logout-btn"
      >
        Logout
      </button>
    </div>
  );
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

const mockUserData = {
  id: 1,
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  accessToken: 'mock-token'
};

describe('AuthProvider - Jest Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Solo limpiar localStorage si está disponible
    if (localStorage && localStorage.clear) {
      localStorage.clear();
    }
  });

  describe('Estado inicial', () => {
    test('debe inicializar sin usuario autenticado', () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
    });

    test('debe restaurar usuario desde localStorage al inicializar', () => {
      // Configurar localStorage con usuario
      localStorage.setItem('auth:user', JSON.stringify(mockUserData));

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as testuser');
    });

    test('debe manejar datos inválidos en localStorage', () => {
      // Configurar localStorage con datos inválidos
      localStorage.setItem('auth:user', 'invalid-json');

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });

    test('debe manejar localStorage vacío', () => {
      localStorage.setItem('auth:user', '');

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
  });

  describe('Funcionalidad de login', () => {
    test('debe realizar login exitoso', async () => {
      mockLoginService.mockResolvedValue(mockUserData);

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const loginBtn = screen.getByTestId('login-btn');
      
      await act(async () => {
        await userEvent.click(loginBtn);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as testuser');
      });

      // Verificar que se guardó en localStorage
      const savedUser = JSON.parse(localStorage.getItem('auth:user') || '{}');
      expect(savedUser.username).toBe('testuser');
    });

    test('debe mostrar cambio de estado durante login', async () => {
      mockLoginService.mockResolvedValue(mockUserData);

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const loginBtn = screen.getByTestId('login-btn');
      
      await act(async () => {
        await userEvent.click(loginBtn);
      });

      await waitFor(() => {
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as testuser');
      });
    });

    test('debe manejar errores de login', async () => {
      mockLoginService.mockRejectedValue(new Error('Login failed'));

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const loginBtn = screen.getByTestId('login-btn');
      
      await act(async () => {
        try {
          await userEvent.click(loginBtn);
        } catch {
          // Error esperado
        }
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
        expect(screen.getByTestId('auth-status')).toHaveTextContent('Not authenticated');
      });

      // Verificar que localStorage no se modificó
      expect(localStorage.getItem('auth:user')).toBeNull();
    });

    test('debe rechazar login con credenciales vacías', async () => {
      const TestEmptyLogin = () => {
        const { login } = useAuth();
        
        const handleEmptyLogin = async () => {
          try {
            await login({ username: '', password: '' });
          } catch {
            console.log('Empty login error');
          }
        };
        
        return (
          <button
            onClick={handleEmptyLogin}
            data-testid="empty-login-btn"
          >
            Empty Login
          </button>
        );
      };

      render(
        <TestWrapper>
          <TestEmptyLogin />
          <TestComponent />
        </TestWrapper>
      );

      const emptyLoginBtn = screen.getByTestId('empty-login-btn');
      
      await act(async () => {
        try {
          await userEvent.click(emptyLoginBtn);
        } catch {
          // Error esperado
        }
      });

      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
  });

  describe('Funcionalidad de logout', () => {
    test('debe realizar logout exitoso', async () => {
      // Configurar estado inicial con usuario logueado
      localStorage.setItem('auth:user', JSON.stringify(mockUserData));

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Verificar estado inicial
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as testuser');

      const logoutBtn = screen.getByTestId('logout-btn');
      
      await act(async () => {
        await userEvent.click(logoutBtn);
      });

      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
      
      // Verificar que se limpió localStorage
      expect(localStorage.getItem('auth:user')).toBeNull();
    });

    test('debe manejar logout cuando no hay usuario', async () => {
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const logoutBtn = screen.getByTestId('logout-btn');
      
      await act(async () => {
        await userEvent.click(logoutBtn);
      });

      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });
  });

  describe('Persistencia de datos', () => {
    test('debe sincronizar cambios en localStorage', async () => {
      mockLoginService.mockResolvedValue(mockUserData);

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      // Login
      const loginBtn = screen.getByTestId('login-btn');
      await act(async () => {
        await userEvent.click(loginBtn);
      });

      await waitFor(() => {
        expect(localStorage.getItem('auth:user')).toBeTruthy();
      });

      // Logout
      const logoutBtn = screen.getByTestId('logout-btn');
      await act(async () => {
        await userEvent.click(logoutBtn);
      });

      expect(localStorage.getItem('auth:user')).toBeNull();
    });

    test('debe manejar múltiples usuarios en sesiones diferentes', async () => {
      const user1 = { ...mockUserData, username: 'user1' };
      const user2 = { ...mockUserData, username: 'user2' };

      // Primera sesión
      mockLoginService.mockResolvedValue(user1);
      
      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const loginBtn = screen.getByTestId('login-btn');
      await act(async () => {
        await userEvent.click(loginBtn);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as user1');
      });

      // Logout
      const logoutBtn = screen.getByTestId('logout-btn');
      await act(async () => {
        await userEvent.click(logoutBtn);
      });

      // Segunda sesión
      mockLoginService.mockResolvedValue(user2);
      
      await act(async () => {
        await userEvent.click(loginBtn);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as user2');
      });
    });
  });

  describe('Manejo de errores y edge cases', () => {
    test('debe manejar errores de parsing en localStorage', () => {
      // Configurar localStorage con JSON malformado
      localStorage.setItem('auth:user', '{invalid json}');

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });

    test('debe manejar localStorage no disponible', () => {
      // Mock localStorage para simular error
      const originalLocalStorage = global.localStorage;
      
      try {
        // Simulando localStorage no disponible
        Object.defineProperty(global, 'localStorage', { value: undefined, configurable: true });

        render(
          <TestWrapper>
            <TestComponent />
          </TestWrapper>
        );

        expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
      } finally {
        // Restaurar localStorage en el finally para asegurar que siempre se restaure
        Object.defineProperty(global, 'localStorage', { value: originalLocalStorage, configurable: true });
      }
    });

    test('debe manejar respuesta completa del servicio', async () => {
      mockLoginService.mockResolvedValue(mockUserData);

      render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      );

      const loginBtn = screen.getByTestId('login-btn');
      
      await act(async () => {
        await userEvent.click(loginBtn);
      });

      await waitFor(() => {
        expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as testuser');
      });
    });
  });

  describe('Contexto y renderizado', () => {
    test('debe proporcionar valores correctos del contexto', () => {
      const ContextChecker = () => {
        const auth = useAuth();
        
        return (
          <div>
            <div data-testid="context-user">{auth.user ? 'Has user' : 'No user'}</div>
            <div data-testid="context-authenticated">{auth.isAuthenticated ? 'Authenticated' : 'Not authenticated'}</div>
            <div data-testid="context-login">{typeof auth.login === 'function' ? 'Has login' : 'No login'}</div>
            <div data-testid="context-logout">{typeof auth.logout === 'function' ? 'Has logout' : 'No logout'}</div>
          </div>
        );
      };

      render(
        <TestWrapper>
          <ContextChecker />
        </TestWrapper>
      );

      expect(screen.getByTestId('context-user')).toHaveTextContent('No user');
      expect(screen.getByTestId('context-authenticated')).toHaveTextContent('Not authenticated');
      expect(screen.getByTestId('context-login')).toHaveTextContent('Has login');
      expect(screen.getByTestId('context-logout')).toHaveTextContent('Has logout');
    });

    test('debe lanzar error si se usa fuera del provider', () => {
      const ConsoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      const ComponentOutsideProvider = () => {
        useAuth(); // Sin try-catch para que la excepción se propague
        return <div>Should not render</div>;
      };

      expect(() => {
        render(<ComponentOutsideProvider />);
      }).toThrow('useAuth must be used within an AuthProvider');

      ConsoleErrorSpy.mockRestore();
    });

    test('debe renderizar múltiples componentes que consumen el contexto', () => {
      const Component1 = () => {
        const { user } = useAuth();
        return <div data-testid="comp1">{user ? 'User in comp1' : 'No user in comp1'}</div>;
      };

      const Component2 = () => {
        const { isAuthenticated } = useAuth();
        return <div data-testid="comp2">{isAuthenticated ? 'Authenticated in comp2' : 'Not authenticated in comp2'}</div>;
      };

      render(
        <TestWrapper>
          <Component1 />
          <Component2 />
        </TestWrapper>
      );

      expect(screen.getByTestId('comp1')).toHaveTextContent('No user in comp1');
      expect(screen.getByTestId('comp2')).toHaveTextContent('Not authenticated in comp2');
    });
  });
});