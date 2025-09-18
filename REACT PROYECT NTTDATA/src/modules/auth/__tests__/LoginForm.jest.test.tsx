// LoginForm.jest.test.tsx - Tests completos con Jest para LoginForm
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '@/modules/auth/components/LoginForm';
import { AuthProvider } from '@/modules/auth/context/AuthProvider';
import { loginService } from '@/modules/auth/services/auth.service';

// Mocks
jest.mock('@/modules/auth/services/auth.service', () => ({
  loginService: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

const mockLoginService = loginService as jest.MockedFunction<typeof loginService>;

describe('LoginForm - Jest Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Renderizado inicial', () => {
    test('debe renderizar todos los elementos del formulario', () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
      expect(screen.getByText(/olvidé contraseña/i)).toBeInTheDocument();
      expect(screen.getByText(/¿no tienes una cuenta\?/i)).toBeInTheDocument();
      expect(screen.getByText(/regístrate/i)).toBeInTheDocument();
    });

    test('debe tener credenciales pre-llenadas para testing', () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(usernameInput).toHaveValue('emilys');
      expect(passwordInput).toHaveValue('emilyspass');
    });

    test('debe tener atributos correctos en los inputs', () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(usernameInput).toHaveAttribute('type', 'text');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(usernameInput).toHaveAttribute('id', 'username');
      expect(passwordInput).toHaveAttribute('id', 'password');
      expect(usernameInput).toBeRequired();
      expect(passwordInput).toBeRequired();
    });
  });

  describe('Interacciones de usuario', () => {
    test('debe permitir cambiar los valores de los inputs', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      await user.clear(usernameInput);
      await user.type(usernameInput, 'nuevouser');
      
      await user.clear(passwordInput);
      await user.type(passwordInput, 'nuevapass');

      expect(usernameInput).toHaveValue('nuevouser');
      expect(passwordInput).toHaveValue('nuevapass');
    });

    test('debe abrir modal de olvidé contraseña al hacer clic', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const forgotPasswordLink = screen.getByText(/olvidé contraseña/i);
      await user.click(forgotPasswordLink);

      await waitFor(() => {
        expect(screen.getByText(/recuperar contraseña/i)).toBeInTheDocument();
      });
    });

    test('debe navegar a registro al hacer clic en regístrate', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const registerLink = screen.getByText(/regístrate/i);
      await user.click(registerLink);

      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });

  describe('Validación de formulario', () => {
    test('debe mostrar error para campos vacíos', async () => {
      const user = userEvent.setup();
      
      const { container } = render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

      // Usar espacios para evitar validación HTML5 nativa pero activar validación custom
      await user.clear(usernameInput);
      await user.type(usernameInput, ' ');
      await user.clear(passwordInput);
      await user.type(passwordInput, ' ');
      await user.click(submitButton);

      await waitFor(() => {
        const modalOverlay = container.querySelector('.modal-overlay');
        expect(modalOverlay).toBeInTheDocument();
        
        const errorElement = container.querySelector('.error-message');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent('Usuario y contraseña no pueden estar vacíos');
      });
    });

    test('debe mostrar error para campos con solo espacios', async () => {
      const user = userEvent.setup();
      
      const { container } = render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;

      await user.clear(usernameInput);
      await user.type(usernameInput, '   ');
      
      await user.clear(passwordInput);
      await user.type(passwordInput, '   ');
      
      await user.click(submitButton);

      await waitFor(() => {
        const errorElement = container.querySelector('.error-message');
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveTextContent('Usuario y contraseña no pueden estar vacíos');
      });
    });
  });

  describe('Estados de carga y éxito', () => {
    test('debe mostrar estado de carga durante login', async () => {
      const user = userEvent.setup();
      
      mockLoginService.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          id: 1,
          username: 'emilys',
          firstName: 'Emily',
          lastName: 'Johnson',
          email: 'emily@test.com',
          accessToken: 'fake-token'
        }), 100))
      );

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: /iniciando sesión/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iniciando sesión/i })).toBeDisabled();
      expect(screen.getByLabelText(/usuario/i)).toBeDisabled();
      expect(screen.getByLabelText(/contraseña/i)).toBeDisabled();
    });

    test('debe navegar al home en login exitoso', async () => {
      const user = userEvent.setup();
      
      mockLoginService.mockResolvedValue({
        id: 1,
        username: 'emilys',
        firstName: 'Emily',
        lastName: 'Johnson',
        email: 'emily@test.com',
        accessToken: 'fake-token'
      });

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
      });
    });
  });

  describe('Manejo de errores', () => {
    test('debe mostrar error de red', async () => {
      const user = userEvent.setup();
      
      mockLoginService.mockRejectedValue(new Error('fetch error'));

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/algo salió mal, inténtelo más tarde/i)).toBeInTheDocument();
      });
    });

    test('debe mostrar error de credenciales', async () => {
      const user = userEvent.setup();
      
      mockLoginService.mockRejectedValue(new Error('Invalid credentials'));

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/las credenciales no son correctas/i)).toBeInTheDocument();
      });
    });

    test('debe cerrar modal de error al hacer clic en cerrar', async () => {
      const user = userEvent.setup();
      
      mockLoginService.mockRejectedValue(new Error('Invalid credentials'));

      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/las credenciales no son correctas/i)).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /cerrar/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(/las credenciales no son correctas/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Accesibilidad y navegación por teclado', () => {
    test('debe tener estructura de formulario accesible', () => {
      const { container } = render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const formElement = container.querySelector('form');
      expect(formElement).toBeInTheDocument();
      
      // Verificar que el formulario tiene elementos accesibles
      const submitButton = container.querySelector('button[type="submit"]');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent('Iniciar sesión');
    });

    test('debe tener labels correctamente asociados', () => {
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);

      expect(usernameInput).toHaveAccessibleName('Usuario:');
      expect(passwordInput).toHaveAccessibleName('Contraseña:');
    });

    test('debe soportar navegación por teclado', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <LoginForm />
        </TestWrapper>
      );

      const usernameInput = screen.getByLabelText(/usuario/i);
      const passwordInput = screen.getByLabelText(/contraseña/i);
      const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

      await user.tab();
      expect(usernameInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });
  });
});